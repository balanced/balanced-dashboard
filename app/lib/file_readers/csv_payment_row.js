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

	process: function() {
		var bankAccountUri = Balanced.BankAccount.constructUri(this.getDeepValue("bank_account.id"));
		var self = this;
		var credit = self.get("credit");
		return Balanced.BankAccount.find(bankAccountUri).then(function(bankAccount) {
			credit.set("destination", bankAccount);
			if (self.get("isValid")) {
				return credit.save().then(function(credit) {
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
