Balanced.CsvPaymentRow = Ember.Object.extend({

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

	columns: function() {
		var self = this;
		return _.map(self.baseObject, function(val, key) {
			return self.deserialize(key, val) || "";
		});
	}.property("baseObject"),

	deserialize: function(key, value) {
		return this.deserializers[key] ?
			this.deserializers[key].call(this, value) :
			value;
	},

	getDeepValue: function(fieldName) {
		var base = this.get("baseObject");
		return this.deserialize(fieldName, base[fieldName]);
	},

	getDeepObject: function() {
		var self = this;
		var deepObject = {};
		var base = this.get("baseObject");

		_.each(base, function(fieldValue, fieldName) {
			var object = deepObject;
			var columnKeys = fieldName.split(".");
			columnKeys.slice(0, -1).forEach(function(key, i) {
				if (!(key in object)) {
					object[key] = {};
				}
				object = object[key];
			});
			object[columnKeys[columnKeys.length - 1]] = self.getDeepValue(fieldName);
		});
		return deepObject;
	},

	credit: function() {
		return this.getCredit();
	}.property("baseObject"),


	buildCustomer: function() {
		var attr = this.getDeepObject().customer;
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
		var attr = this.getDeepObject().bank_account;
		if (attr.id && attr.id.length > 0) {
			var uri = Balanced.BankAccount.constructUri(attr.id);
			return Balanced.BankAccount.find(uri).then(function(bankAccount) {
				return {
					bankAccount: bank
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

	getCredit: function() {
		var self = this;
		var deepObject = this.getDeepObject();
		var credit = Balanced.Credit.create(deepObject.credit);

		this.buildCustomer().then(function(result) {
			self.setCreditCustomer(credit, result.customer);
		});

		this.buildBankAccount().then(function(result) {
			self.setCreditBankAccount(credit, result.bankAccount);
		});

		return credit;
	},

	saveCustomer: function(customer) {
		if (customer) {
			return customer.save();
		}
		else {
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

	isValid: function (customer, bank, credit) {
		return bank && credit.get("amount") > 0;
	},

	save: function() {
		var self = this;
		var credit = this.get("credit");
		var bank = credit.get("bank_account");
		var customer = credit.get("customer");

		if (this.isValid(customer, bank, credit)) {
			return this.saveCustomer(customer)
				.then(function(c) {
					customer = c;
					return self.saveBank(c, bank);
				}).then(function(b) {
					bank = b;
					return self.saveCredit(customer, bank, credit);
				});
		}
		else {
			return Ember.RSVP.resolve(null);
		}
	}
});
