require("balanced-dashboard/lib/validation_helpers");
var ValidationHelpers = Balanced.ValidationHelpers;

var baseValidationsObject = {
	"csvFields.appears_on_statement_as": ValidationHelpers.bankTransactionAppearsOnStatementAs,
	"csvFields.amount": ValidationHelpers.positiveDollarAmount,
};

Balanced.CreditCreator = Ember.Object.extend(Ember.Validations, {

	isInvalid: Ember.computed.gt("validationErrors.length", 0),
	isValid: Ember.computed.not("isInvalid"),

	appears_on_statement_max_length: Balanced.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT,

	isLoaded: function() {
		var self = this;
		var fields = ["credit", "bankAccount", "customer"];
		return fields.every(function(field) {
			return self.get(field) !== undefined;
		});
	}.property("credit", "bankAccount", "customer"),

	isSaved: Ember.computed.not("credit.isNew"),
	isSaveable: Ember.computed.and("credit.isNew", "isValid"),

	canSave: function() {
		var self = this;
		return this.get("isValid") && _.every(["bankAccount", "credit", "customer"], function(key) {
			return self.get(key).get("isValid");
		});
	},

	credit: function() {
		var mapper = Balanced.CreditCreatorCsvObjectMapper.create();
		var attr = mapper.extractCreditAttributes(this.get("csvFields"));
		var customer = this.get("customer");
		var bankAccount = this.get("bankAccount");

		var attributes = _.extend({}, attr, {
			customer: customer,
		});

		if (bankAccount) {
			_.extend(attributes, {
				destination: bankAccount,
				bank_account: bankAccount,
				uri: bankAccount.get("credits_uri")
			});
		}

		return Balanced.Credit.create(attributes);
	}.property("csvFields", "bankAccount", "bankAccount.credits_uri", "customer"),

	getErrorMessagesSentences: function() {
		var self = this;
		var errors = [];
		["csvFields", "bankAccount", "customer"].forEach(function(name) {
			var messages = self.get("validationErrors." + name + ".allMessages") || [];
			errors = errors.concat(messages);
		});

		return errors.map(function(value) {
			return value.join(" ");
		});
	},

	toLabeledCsvRowObject: function() {
		var self = this;
		var result = {};
		var csvFields = self.get("fieldNames");

		_.each(csvFields, function(columnName) {
			result[columnName] = self.get("csvFields." + columnName) || "";
		});

		result.errors = this.getErrorMessagesSentences().join("\n");
		return result;
	}
});

Balanced.CreditCreator.reopenClass({
	isValidCreditCreatorColumns: function(csvColumns) {
		var requiredColumns = [
			Balanced.ExistingCustomerCreditCreator.fieldNames,
			Balanced.NewCustomerCreditCreator.fieldNames
		];
		return requiredColumns.any(function(requiredColumns) {
			return _.difference(requiredColumns, csvColumns).length === 0;
		});
	},
	fromCsvRow: function(marketplace, object) {
		var creditCreator = null;

		if (object.existing_customer_name_or_email !== undefined) {
			creditCreator = Balanced.ExistingCustomerCreditCreator.createFromQuery(marketplace, object);
		} else {
			creditCreator = Balanced.NewCustomerCreditCreator.create({
				csvFields: object
			});
		}
		creditCreator.validate();
		return creditCreator;
	}
});

Balanced.NewCustomerCreditCreator = Balanced.CreditCreator.extend({
	fieldNames: ["new_customer_name", "new_customer_email", "new_bank_routing_number", "new_bank_account_number", "new_bank_account_holders_name", "new_bank_account_type", "amount", "appears_on_statement_as", "description"],

	getErrorObject: function() {
		var properties = this.getProperties(
			"new_customer_name",
			"new_customer_email",
			"new_bank_routing_number",
			"new_bank_account_holders_name",
			"new_bank_account_type",
			"amount",
			"appears_on_statement_as",
			"description"
		);

		var bankAccountNumber = this.get("new_bank_account_number");

		properties.new_bank_account_number = bankAccountNumber && bankAccountNumber.length > 0 ?
			"HIDDEN" :
			"EMPTY";
		return properties;
	},

	validations: _.extend({}, baseValidationsObject, {
		"csvFields.new_customer_name": {
			presence: true
		},
		"csvFields.new_customer_email": {
			presence: true
		},
		"csvFields.new_bank_routing_number": ValidationHelpers.bankAccountRoutingNumber,
		"csvFields.new_bank_account_number": ValidationHelpers.bankAccountNumber,
		"csvFields.new_bank_account_holders_name": ValidationHelpers.bankAccountName,
		"csvFields.new_bank_account_type": ValidationHelpers.bankAccountType,
	}),

	isExisting: false,

	bankAccount: function() {
		var mapper = Balanced.CreditCreatorCsvObjectMapper.create();
		var attr = mapper.extractBankAccountAttributes(this.get("csvFields"));
		return Balanced.BankAccount.create(attr);
	}.property("csvFields"),

	customer: function() {
		var mapper = Balanced.CreditCreatorCsvObjectMapper.create();
		var attr = mapper.extractCustomerAttributes(this.get("csvFields"));
		return Balanced.Customer.create(attr);
	}.property("csvFields"),

	save: function() {
		var self = this;

		if (!self.canSave()) {
			return Ember.RSVP.reject();
		}

		return self.get("customer").save()
			.then(function() {
				return self.get("bankAccount").save();
			})
			.then(function() {
				var bankAccount = self.get("bankAccount");
				bankAccount.set("links.customer", self.get("customer.id"));
				return bankAccount.save();
			})
			.then(function() {
				return self.get("credit").save();
			});
	}
});

Balanced.NewCustomerCreditCreator.reopenClass({
	fieldNames: ["new_customer_name", "new_customer_email", "new_bank_routing_number", "new_bank_account_number", "new_bank_account_holders_name", "new_bank_account_type", "amount", "appears_on_statement_as", "description"]
});

Balanced.ExistingCustomerCreditCreator = Balanced.CreditCreator.extend({
	validations: _.extend({}, baseValidationsObject, {
		"csvFields.existing_customer_name_or_email": {
			presence: true,
		},
		customer: {
			existence: {
				validator: function(object, attribute, customer) {
					var matchesLength = object.get("customersCollection.length");

					if (matchesLength === 0) {
						object.get("validationErrors").add("csvFields.existing_customer_name_or_email", "existence", null, "no matching customer found");
					} else if (matchesLength > 1) {
						object.get("validationErrors").add("csvFields.existing_customer_name_or_email", "existence", null, "multiple customers found");
					}
				}
			}
		},
		bankAccount: {
			existence: {
				validator: function(object, attribute, value) {
					var matchesLength = object.get("customer.bank_accounts.length");

					if (matchesLength === 0) {
						object.get("validationErrors").add("bankAccount", "existence", null, "no bank accounts available");
					} else if (matchesLength > 1) {
						object.get("validationErrors").add("bankAccount", "existence", null, "multiple bank accounts found");
					}
				}
			}
		},
	}),

	getErrorObject: function() {
		return this.getProperties(
			"existing_customer_name_or_email",
			"amount",
			"appears_on_statement_as",
			"description"
		);
	},

	fieldNames: ["existing_customer_name_or_email", "amount", "appears_on_statement_as", "description"],
	isExisting: true,

	save: function() {
		return this.get('credit').save();
	},

	customer: function() {
		var collection = this.get("customersCollection");

		if (collection) {
			return collection.get("length") === 1 ?
				collection.objectAt(0) :
				null;
		}
		return undefined;
	}.property("customersCollection", "customersCollection.length"),

	bankAccount: function() {
		var customer = this.get("customer");
		var collection = this.get("customer.bank_accounts");

		if (customer === null) {
			return null;
		} else if (collection) {
			return collection.get("length") === 1 ?
				collection.objectAt(0) :
				null;
		}
		return undefined;
	}.property("customer", "customer.bank_accounts", "customer.bank_accounts.length")
});

Balanced.ExistingCustomerCreditCreator.reopenClass({
	fieldNames: ["existing_customer_name_or_email", "amount", "appears_on_statement_as", "description"],
	createFromQuery: function(marketplace, attributes) {
		var creator = this.create({
			csvFields: attributes
		});

		var results = Balanced.Customer.findByNameOrEmail(marketplace, attributes.existing_customer_name_or_email);
		results.addObserver("isLoaded", function() {
			creator.set("customersCollection", results);
		});
		creator.addObserver("isLoaded", function() {
			creator.validate();
		});

		return creator;
	}
});
