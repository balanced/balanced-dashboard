import Constants from "balanced-dashboard/utils/constants";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";

var baseValidationsObject = {
	"csvFields.appears_on_statement_as": ValidationHelpers.bankTransactionAppearsOnStatementAs,
	"csvFields.amount": ValidationHelpers.positiveDollarAmount,
};

var CreditCreator = Ember.Object.extend(Ember.Validations, {

	isInvalid: Ember.computed.gt("validationErrors.length", 0),
	isValid: Ember.computed.not("isInvalid"),

	appears_on_statement_max_length: Constants.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT,

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

CreditCreator.reopenClass({
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

export default CreditCreator;

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
