Balanced.CsvPaymentRow = Ember.Object.extend({

	init: function() {
		this._super();
		this.set("errors", []);
	},

	isValid: function() {
		var amount = this.get("credit.amount");
		return amount !== undefined && amount > 0 && this.get("errors.length") === 0;
	}.property("credit.amount", "errors.length"),

	isSubmittable: function() {
		return this.get("isValid") && this.get("credit.isNew");
	}.property("isValid", "credit.isNew", "credit.isSaving"),

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
		var creditAttributes = this.getDeepObject().credit;
		return Balanced.Credit.create(creditAttributes);
	}.property("baseObject"),

	isNewBankAccount: function() {
		var bank = this.getDeepObject().bank_account;
		return bank && (bank.id === undefined || bank.id.length === 0);
	},

	isNewCustomer: function() {
		var customer = this.getDeepObject().customer;
		if (customer) {
			var name = customer.name && customer.name.length > 0;
			var email = customer.email && customer.email.length > 0;
			return (name || email);
		} else {
			return false;
		}
	},

	getCustomer: function() {
		if (this.isNewCustomer()) {
			var customer = Balanced.Customer.create(this.getDeepObject().customer);
			return customer.save()
		} else {
			return Ember.RSVP.resolve(null);
		}
	},

	getBankAccount: function(customer) {
		if (this.isNewBankAccount()) {
			var b = Balanced.BankAccount.create(this.getDeepObject().bank_account);
			return customer ?
				b.tokenizeAndCreate(customer.get("id")) :
				b.save();
		} else {
			var uri = Balanced.BankAccount.constructUri(this.getDeepValue("bank_account.id"));
			return Balanced.BankAccount.find(uri);
		}
	},

	saveCredit: function(linkedObjects) {
		var credit = this.get("credit");
		credit.setProperties(linkedObjects);
		if (this.get("isValid")) {
			return credit.save();
		} else {
			this.get("errors").pushObject("The credit amount is not valid.");
			return Ember.RSVP.reject(credit);
		}
	},

	process: function() {
		var self = this;
		var customer;

		return self.getCustomer()
			.then(function(c) {
				customer = c;
				return self.getBankAccount(customer);
			})
			.then(function(bankAccount) {
				var linkedObjects = {
					destination: bankAccount,
					customer: customer
				}
				return self.saveCredit(linkedObjects)
			})
			.then(function(credit) {
				return credit;
			}, function(err) {
				var errorMessage = err.get("errorDescription") || "Unknown Error";
				self.get("errors").pushObject(errorMessage);
			});
	}
});
