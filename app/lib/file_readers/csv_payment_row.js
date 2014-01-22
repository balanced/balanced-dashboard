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
		var name = customer.name && customer.name.length > 0;
		var email = customer.email && customer.email.length > 0;
		return customer && (name || email);
	},

	getCustomer: function() {
		if (this.isNewCustomer()) {
			var customer = Balanced.Customer.create(this.getDeepObject().customer);
			return customer.save()
		} else {
			return Ember.RSVP.resolve(null);
		}
	},

	getLinkedObjects: function() {
		var self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
			var resolver = function(customer, bank) {
				var o = {
					destination: bank
				};

				if (customer) {
					o.customer = customer;
				}

				resolve(o);
			};
			if (self.isNewBankAccount()) {
				var b = Balanced.BankAccount.create(self.getDeepObject().bank_account);
				self.getCustomer().then(function(customer) {
					if (customer) {
						b.tokenizeAndCreate(customer.get("id")).then(function(bankAccount) {
							resolver(customer, bankAccount);
						});
					} else {
						b.save().then(function(bankAccount) {
							resolver(null, bankAccount);
						});
					}
				});
			} else {
				var uri = Balanced.BankAccount.constructUri(self.getDeepValue("bank_account.id"));
				return Balanced.BankAccount.find(uri).then(function(bankAccount) {
					resolver(null, bankAccount);
				});
			}
		});
	},

	process: function() {
		var self = this;
		var credit = self.get("credit");
		return self.getLinkedObjects().then(function(linkedObjects) {
			credit.setProperties(linkedObjects);
			if (self.get("isValid")) {
				return credit.save().then(function() {
					return credit;
				}, function(err) {
					self.get("errors").pushObject("Unknown error.");
					return credit;
				});
			} else {
				self.get("errors").pushObject("The credit amount is not valid.");
				return null;
			}
		}, function(err) {
			self.get("errors").pushObject("Bank account problem");
			return credit;
		});
	}

});
