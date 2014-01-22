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
		return Ember.RSVP.resolve({
			customer: Balanced.Customer.create(attr)
		});
	},

	buildBankAccount: function() {
		var attr = this.getDeepObject().bank_account;
		if (attr.id && attr.id.length > 0) {
			var uri = Balanced.BankAccount.constructUri(attr.id);
			return Balanced.BankAccount.find(uri).then(function(bank) {
				return {
					bank: bank
				};
			});
		} else {
			return Ember.RSVP.resolve({
				bank: Balanced.BankAccount.create(attr)
			});
		}
	},

	getCredit: function() {
		var deepObject = this.getDeepObject();
		var credit = Balanced.Credit.create(deepObject.credit);

		this.buildCustomer().then(function(result) {
			credit.setProperties({
				customer: result.customer
			});
		});

		this.buildBankAccount().then(function(result) {
			var bank = result.bank;
			var options = {
				destination: bank,
				bank_account: bank
			};
			if (bank.get("credits_uri")) {
				options.uri = bank.get("credits_uri");
			}
			credit.setProperties(options);
		});

		return credit;
	},

	saveCustomer: function(customer) {
		return customer.save();
	},

	saveBank: function(customer, bank) {
		if (bank.get("isNew")) {
			return bank.tokenizeAndCreate(customer.get("id"))
				.then(function(b) {
					return b.reload();
				});
		} else {
			return bank;
		}
	},

	saveCredit: function(customer, bank, credit) {
		credit.set("uri", bank.get("credits_uri"));
		return credit.save();
	},

	save: function() {
		var self = this;
		var credit = this.get("credit");
		var bank = credit.get("bank_account");
		var customer = credit.get("customer");
		return this.saveCustomer(customer)
			.then(function(c) {
				return self.saveBank(c, bank);
			}).then(function(b) {
				return self.saveCredit(customer, b, credit);
			});
	}
});
