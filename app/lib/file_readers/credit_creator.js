var formatValidator = function(callback) {
	return {
		validator: function(object, attribute, value) {
			value = (value || "").trim();
			callback(object, attribute, value, function(messages) {
				messages = _.isArray(messages) ? messages : [messages];

				messages.forEach(function(message) {
					object.get("validationErrors").add(attribute, "format", null, message);
				});
			});
		}
	};
};

var baseValidationsObject = {
	"csvFields.appears_on_statement_as": {
		presence: true,
		format: formatValidator(function(object, attribute, value, cb) {
			var messages = [];
			if (value.length > 14) {
				messages.push("must be under 15 characters");
			}

			var invalidCharacters = Balanced.Transaction.findAppearsOnStatementAsInvalidCharacters(value);
			if (invalidCharacters.length === 1) {
				messages.push('"%@" is an invalid character'.fmt(invalidCharacters));
			} else if (invalidCharacters.length > 1) {
				messages.push('"%@" are invalid characters'.fmt(invalidCharacters));
			}
			cb(messages);
		})
	},

	"csvFields.amount": {
		presence: true,
		format: formatValidator(function(object, attribute, value, cb) {
			var v = parseFloat(value, 10);
			if (isNaN(v) || v <= 0) {
				cb("must be a positive number");
			}
		})
	}
};

Balanced.CreditCreator = Ember.Object.extend(Ember.Validations, {

	isInvalid: Ember.computed.gt("validationErrors.length", 0),
	isValid: Ember.computed.not("isInvalid"),

	isLoaded: function() {
		var self = this;
		var fields = ["credit", "bankAccount", "customer"];
		return fields.every(function(field) {
			return self.get(field) !== undefined;
		});
	}.property("credit", "bankAccount", "customer"),

	isSaved: Ember.computed.not("credit.isNew"),
	isSaveable: Ember.computed.and("credit.isNew", "isValid"),

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

	getSortedErrorMessages: function() {
		var result = {};
		var errors = this.get("validationErrors.allMessages");
		errors.forEach(function(value) {
			var key = value[0];
			var message = value[1];

			result[message] = result[message] || [];
			result[message].push(key);
		});
		return result;
	},

	getErrorMessagesSentences: function() {
		var results = [];
		var errors = this.get("validationErrors.csvFields.allMessages") || [];
		errors.forEach(function(value) {
			results.push(value.join(" "));
		});
		return results;
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

Balanced.ExistingCustomerCreditCreator = Balanced.CreditCreator.extend({
	validations: _.extend({}, baseValidationsObject, {
		"csvFields.existing_customer_name_or_email": {
			presence: true
		}
	}),

	fieldNames: ["existing_customer_name_or_email", "amount", "appears_on_statement_as", "description"],
	isExisting: true,

	save: function() {
		return this.get('credit').save();
	}
});

Balanced.NewCustomerCreditCreator = Balanced.CreditCreator.extend({
	fieldNames: ["new_customer_name", "new_customer_email", "new_bank_account_routing_number", "new_bank_account_number", "new_bank_account_holders_name", "new_bank_account_type", "amount", "appears_on_statement_as", "description"],

	validations: _.extend({}, baseValidationsObject, {
		"csvFields.new_bank_account_type": {
			presence: true,
			format: formatValidator(function(object, attribute, value, cb) {
				var validStrings = ["checking", "savings"];
				value = value.toLowerCase();
				if (validStrings.indexOf(value) < 0) {
					cb("%@ is not a valid bank account type".fmt(value));
				}
			})
		},
		"csvFields.new_customer_name": {
			presence: true
		},
		"csvFields.new_customer_email": {
			presence: true
		},
		"csvFields.new_bank_account_routing_number": {
			presence: true,
			format: formatValidator(function(object, attribute, value, cb) {
				value = value.toLowerCase();
				if (!balanced.bankAccount.validateRoutingNumber(value)) {
					cb("%@ is not a valid bank account routing number".fmt(value));
				}
			})
		},
		"csvFields.new_bank_account_number": {
			presence: true
		},
		"csvFields.new_bank_account_holders_name": {
			presence: true
		}
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
		return self.get("customer").save()
			.then(function() {
				return self.get("bankAccount").save();
			})
			.then(function() {
				return self.get("credit").save();
			});
	}
});

Balanced.ExistingCustomerCreditCreator.reopenClass({
	createFromQuery: function(marketplace, attributes) {
		var creator = this.create({
			csvFields: attributes
		});

		var results = Balanced.Customer.findByNameOrEmail(marketplace, attributes.existing_customer_name_or_email);
		// TODO[carlos] this should check for arrays being length === 1
		results.addObserver("isLoaded", function() {
			var customer = results.get("content")[0];
			creator.set("customer", customer);
			customer.get("bank_accounts").then(function(bankAccountsCollection) {
				var bankAccount = bankAccountsCollection.get("content")[0];
				creator.set("bankAccount", bankAccount);
			});
		});

		return creator;
	}
});

Balanced.CreditCreator.reopenClass({
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
