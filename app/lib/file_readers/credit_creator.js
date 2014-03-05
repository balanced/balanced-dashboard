var computedState = function(stateValue) {
	return Ember.computed.equal("state", stateValue);
};

var formatValidator = function(callback) {
	return {
		validator: function(object, attribute, value) {
			value = (value || "").trim();
			callback(object, attribute, value, function(message) {
				if (message) {
					object.get("validationErrors").add(attribute, "format", null, message);
				}
			});
		}
	};
};

var BANK_ACCOUNT_ID_SPECIFIED_ERROR = "cannot specify a bank_account_id with this field";

var accountFieldRequired = function(fieldName) {
	return formatValidator(function(object, attribute, value, cb) {
		if (object.isExistingBankAccount()) {
			if (value.length > 0) {
				cb(BANK_ACCOUNT_ID_SPECIFIED_ERROR);
			}
		} else if (value.length === 0) {
			cb("can't be blank");
		}
	});
};

Balanced.CreditCreator = Ember.Object.extend(Ember.Validations, {

	validations: {

		"csvFields.bank_account_id": {
			format: formatValidator(function(object, attribute, value, cb) {
				if (value.length && object.get("bankAccount") === undefined) {
					cb("bank account has not been loaded.");
				}
			})
		},
		"csvFields.appears_on_statement_as": {
			presence: true
		},
		"csvFields.amount": {
			presence: true,
			format: formatValidator(function(object, attribute, value, cb) {
				var v = parseFloat(value, 10);
				if (isNaN(v) || v <= 0) {
					cb("must be a positive number");
				}
			})
		},
		"csvFields.new_bank_account_type": {
			format: formatValidator(function(object, attribute, value, cb) {
				var validStrings = ["checking", "savings"];
				value = value.toLowerCase();
				if (object.isExistingBankAccount()) {
					if (value.length > 0) {
						cb(BANK_ACCOUNT_ID_SPECIFIED_ERROR);
					}
				} else if (value.length === 0) {
					cb("can't be blank");
				} else if (validStrings.indexOf(value) < 0) {
					cb("%@ is not a valid bank account type".fmt(value));
				}
			})
		},
		"csvFields.new_customer_name": {
			format: accountFieldRequired("new_customer_name")
		},
		"csvFields.new_customer_email": {
			format: accountFieldRequired("new_customer_email")
		},
		"csvFields.new_bank_account_routing_number": {
			format: formatValidator(function(object, attribute, value, cb) {
				value = value.toLowerCase();
				if (object.isExistingBankAccount()) {
					if (value.length > 0) {
						cb(BANK_ACCOUNT_ID_SPECIFIED_ERROR);
					}
				} else if (value.length === 0) {
					cb("can't be blank");
				} else if (!balanced.bankAccount.validateRoutingNumber(value)) {
					cb("%@ is not a valid bank account routing number".fmt(value));
				}
			})
		},
		"csvFields.new_bank_account_number": {
			format: accountFieldRequired("new_bank_account_number")
		},
		"csvFields.new_bank_account_holders_name": {
			format: accountFieldRequired("new_bank_account_holders_name")
		}
	},

	isInvalid: Ember.computed.gt("validationErrors.length", 0),
	isValid: Ember.computed.not("isInvalid"),
	isProcessing: false,

	isLoaded: function() {
		var self = this;
		var fields = ["credit", "bankAccount", "customer"];
		return !fields.any(function(field) {
			return self.get(field) === undefined;
		});
	}.property("credit", "bankAccount", "customer"),

	isSaved: Ember.computed.not("credit.isNew"),
	isSaveable: Ember.computed.and("credit.isNew", "isValid"),

	credit: function() {
		var self = this;
		var credit = Balanced.Credit.create(self.get("attributes.credit") || {});

		self.set("credit", credit);

		self.buildCustomer()
			.then(function(result) {
				var customer = result.customer;
				self.set("customer", customer);
				self.setCreditCustomer(credit, customer);
			});

		self.buildBankAccount()
			.then(function(result) {
				var bankAccount = result.bankAccount;
				self.set("bankAccount", bankAccount);
				self.setCreditBankAccount(credit, bankAccount);
			});

		return credit;
	}.property("attributes"),

	attributes: function() {
		var mapper = Balanced.CreditCreatorCsvObjectMapper.create();
		var object = this.get("csvFields");
		return mapper.convertCreditCsvRowToObject(object);
	}.property("csvFields"),

	buildCustomer: function() {
		var attr = this.get("attributes.customer") || {};
		var email = $.trim(attr.email || "");
		var name = $.trim(attr.name || "");

		var resultAttributes = null;
		if (email.length > 0 && name.length > 0) {
			resultAttributes = Balanced.Customer.create({
				email: email,
				name: name
			});
		}
		return Ember.RSVP.resolve({
			customer: resultAttributes
		});
	},

	isExistingBankAccount: function() {
		var id = (this.get("attributes.bank_account.id") || "").trim();
		return id.length > 0;
	},

	buildBankAccount: function() {
		var self = this;
		var attr = this.get("attributes.bank_account") || {};
		if (this.isExistingBankAccount()) {
			var uri = Balanced.BankAccount.constructUri(attr.id);
			return Balanced.BankAccount.find(uri).then(function(bankAccount) {
				self.get("validationErrors").remove("csvFields.bank_account_id");
				return {
					bankAccount: bankAccount
				};
			}, function() {
				var message = "bank account id %@ not found"
					.fmt(self.get("csvFields.bank_account_id"));
				self.get("validationErrors").remove("csvFields.bank_account_id");
				self.get("validationErrors")
					.add("csvFields.bank_account_id", "format", null, message);
				return Ember.RSVP.resolve({
					bankAccount: null
				});
			});
		} else if (balanced.bankAccount.validate(attr).length) {
			return Ember.RSVP.resolve({
				bankAccount: null
			});
		} else {
			return Ember.RSVP.resolve({
				bankAccount: Balanced.BankAccount.create(attr)
			});
		}
	},

	setCreditCustomer: function(credit, customer) {
		if (customer) {
			credit.setProperties({
				customer: customer
			});
		}
	},

	setCreditBankAccount: function(credit, bankAccount) {
		if (bankAccount) {
			var options = {
				destination: bankAccount,
				bank_account: bankAccount
			};
			if (bankAccount.get("credits_uri")) {
				options.uri = bankAccount.get("credits_uri");
			}
			credit.setProperties(options);
		}
	},

	saveCustomer: function() {
		var customer = this.get("customer");
		return customer === null ?
			Ember.RSVP.resolve(null) :
			customer.save();
	},

	saveBank: function() {
		var self = this;
		var customer = this.get("customer");
		var bankAccount = this.get("bankAccount");

		if (bankAccount.get("isNew")) {
			return bankAccount.save()
				.then(function(bankAccount) {
					if (customer) {
						bankAccount.set("links.customer", customer.get("id"));
						return bankAccount.save();
					} else {
						return bankAccount;
					}
				})
				.then(function(bankAccount) {
					return bankAccount.reload();
				})
				.then(function(bankAccount) {
					self.set("bankAccount", bankAccount);
					return bankAccount;
				});
		} else {
			return Ember.RSVP.resolve(bankAccount);
		}
	},

	saveCredit: function() {
		var credit = this.get('credit');
		var bankAccount = this.get("bankAccount");
		credit.set("uri", bankAccount.get("credits_uri"));
		return credit.save();
	},

	save: function() {
		var self = this;
		var credit = this.get('credit');

		if (this.get("isSaveable")) {
			this.set("isProcessing", true);
			return this.saveCustomer()
				.then(function(c) {
					self.set("customer", c);
					return self.saveBank();
				})
				.then(function(b) {
					return self.saveCredit();
				})
				.then(function() {
					self.set("isProcessing", false);
					return self;
				});
		} else {
			return Ember.RSVP.resolve(null);
		}
	},

	getSortedErrorMessages: function () {
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
		var columnNames = "bank_account_id new_customer_name new_customer_email new_bank_account_routing_number new_bank_account_number new_bank_account_holders_name new_bank_account_type amount appears_on_statement_as description".split(" ");
		columnNames.forEach(function(columnName) {
			result[columnName] = self.get("csvFields." + columnName);
		});

		var errors = [];
		result.errors = this.getErrorMessagesSentences().join("\n");
		return result;
	}
});

Balanced.CreditCreator.reopenClass({
	build: function(attributes) {
		return this.create({
			attributes: attributes
		});
	},

	fromCsvRow: function(object) {
		var creditCreator = this.create({
			csvFields: object
		});
		creditCreator.validate();
		return creditCreator;
	}
});
