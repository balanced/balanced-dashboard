Balanced.CreditCreator = Ember.Object.extend({

	credit: function() {
		var self = this;
		var credit = Balanced.Credit.create(this.get("attributes.credit") || {});
		var bankAccount, customer;

		this.buildCustomer().then(function(result) {
			customer = result.customer;
			self.setCreditCustomer(credit, customer);
			self.setValidity(customer, bankAccount, credit);
		});

		this.buildBankAccount().then(function(result) {
			bankAccount = result.bankAccount;
			self.setCreditBankAccount(credit, bankAccount);
			self.setValidity(customer, bankAccount, credit);
		});

		return credit;
	}.property("attributes"),

	buildCustomer: function() {
		var attr = this.get("attributes.customer") || {};
		var email = $.trim(attr.email || "");
		var name = $.trim(attr.name || "");

		var resultAttributes;
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

	buildBankAccount: function() {
		var attr = this.get("attributes.bank_account") || {};
		if (attr.id && attr.id.length > 0) {
			var uri = Balanced.BankAccount.constructUri(attr.id);
			return Balanced.BankAccount.find(uri).then(function(bankAccount) {
				return {
					bankAccount: bankAccount
				};
			});
		} else if (balanced.bankAccount.validate(attr).length) {
			return Ember.RSVP.resolve({
				bankAccount: undefined
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

	saveCustomer: function(customer) {
		if (customer) {
			return customer.save();
		} else {
			return Ember.RSVP.resolve(null);
		}
	},

	saveBank: function(customer, bank) {
		if (bank.get("isNew") && customer) {
			return bank.tokenizeAndCreate(customer.get("id")).then(function(b) {
				return b.reload();
			});
		} else if (bank.get("isNew")) {
			return bank.save();
		} else {
			return bank;
		}
	},

	saveCredit: function(customer, bank, credit) {
		credit.set("uri", bank.get("credits_uri"));
		return credit.save();
	},

	isValid: function(customer, bank, credit) {
		return bank && credit.get("amount") > 0;
	},

	setValidity: function(customer, bank, credit) {
		if (!this.isValid(customer, bank, credit)) {
			credit.set("status", "invalid");
		} else {
			credit.set("status", undefined);
		}
	},

	save: function() {
		var self = this;
		var credit = this.get("credit");
		var bank = credit.get("bank_account");
		var customer = credit.get("customer");

		if (credit.get("isNew") && this.isValid(customer, bank, credit)) {
			return this.saveCustomer(customer)
				.then(function(c) {
					customer = c;
					return self.saveBank(c, bank);
				}).then(function(b) {
					bank = b;
					return self.saveCredit(customer, bank, credit);
				});
		} else {
			return Ember.RSVP.resolve(null);
		}
	}
});

Balanced.CreditCreator.reopenClass({
	build: function(object) {
		return this.create({
			attributes: object
		});
	},

	fromObject: function(object, keysMapping) {
		var mappedObject = {};
		_.each(object, function(value, key) {
			if (keysMapping[key]) {
				key = keysMapping[key];
			}
			mappedObject[key] = value;
		});
		var mapper = Balanced.CsvObjectMapper.create();
		return this.build(mapper.getDeepObject(mappedObject));
	},

	fromCsvRow: function(object) {
		var keysMapping = {
			"bank_account_id": "bank_account.id",
			"amount_in_cents": "credit.amount",
			"new_bank_account_routing_number": "bank_account.routing_number",
			"new_bank_account_number": "bank_account.account_number",
			"new_bank_account_name": "bank_account.name",
			"new_bank_account_type": "bank_account.type",
			"appears_on_statement_as": "credit.appears_on_statement_as",
			"description": "credit.description",
			"new_customer_email": "customer.email",
			"new_customer_name": "customer.name"
		};
		return this.fromObject(object, keysMapping);
	},
});

Balanced.CsvObjectMapper = Ember.Object.extend({
	deserializers: {
		"bank_account.type": function(v) {
			return v.toLowerCase();
		},
		"credit.amount": function(v) {
			var value = parseFloat(v, 10);
			if (isNaN(value) || value < 0) {
				return undefined;
			} else {
				return value;
			}
		}
	},

	mapValue: function(key, value) {
		return this.deserializers[key] ?
			this.deserializers[key].call(this, value) :
			value;
	},

	getDeepObject: function(base) {
		var self = this;
		var deepObject = {};

		_.each(base, function(fieldValue, fieldName) {
			var object = deepObject;
			var columnKeys = fieldName.split(".");
			columnKeys.slice(0, -1).forEach(function(key, i) {
				if (!(key in object)) {
					object[key] = {};
				}
				object = object[key];
			});
			object[columnKeys[columnKeys.length - 1]] = self.mapValue(fieldName, fieldValue);
		});
		return deepObject;
	}
});
