var computedState = function (stateValue) {
	return Ember.computed.equal("state", stateValue);
};

Balanced.CreditCreator = Ember.Object.extend({

	isRemoved: function() {
		return this.get("removed") || false;
	}.property("removed"),

	isActive: Ember.computed.not("isRemoved"),
	isLoading: computedState("loading"),
	isInvalid: computedState("invalid"),
	isProcessing: computedState("processing"),
	isComplete: computedState("complete"),

	toggleRemove: function() {
		var value = this.get("removed");
		this.set("removed", !value);
	},

	credit: function() {
		var self = this;
		var credit = Balanced.Credit.create(self.get("attributes.credit") || {});

		self.set("credit", credit);

		self.buildCustomer()
			.then(function(result) {
				var customer = result.customer;
				self.set("customer", customer);
				self.setCreditCustomer(credit, customer);
				self.refreshState();
			});

		self.buildBankAccount()
			.then(function(result) {
				var bankAccount = result.bankAccount;
				self.set("bankAccount", bankAccount);
				self.setCreditBankAccount(credit, bankAccount);
				self.refreshState();
			});

		self.refreshState();
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

	isBankAccountLoaded: function() {
		return this.get("bankAccount") !== undefined;
	},

	isCustomerLoaded: function() {
		return this.get("customer") !== undefined;
	},

	isCreditLoaded: function() {
		return this.get("credit") !== undefined
	},

	isLoaded: function() {
		return this.isCreditLoaded() && this.isCustomerLoaded() && this.isBankAccountLoaded();
	},

	isCustomerValid: function() {
		return this.isCustomerLoaded();
	},

	isBankAccountValid: function() {
		return this.isBankAccountLoaded() && this.get("bankAccount") !== null;
	},

	isCreditValid: function() {
		return this.isCreditLoaded() && this.get("credit.amount") > 0;
	},

	isValid: function() {
		return this.isCreditValid() && this.isCustomerValid() && this.isBankAccountValid();
	},

	isSaved: function() {
		return !this.get("credit.isNew");
	},

	refreshState: function() {
		if (!this.isLoaded()) {
			this.set("state", "loading");
		} else if (!this.isValid()) {
			this.set("state", "invalid");
		} else if (this.isSaved()) {
			this.set("state", "complete");
		} else {
			this.set("state", "idle");
		}
	},

	save: function() {
		var self = this;
		var credit = this.get('credit');

		var attr = this.get("attributes");

		if (credit.get("isNew") && this.isValid()) {
			this.set("state", "processing");
			return this.saveCustomer()
				.then(function(c) {
					self.set("customer", c);
					return self.saveBank();
				})
				.then(function(b) {
					return self.saveCredit();
				})
				.then(function() {
					self.refreshState();
					return self;
				});
		} else {
			return Ember.RSVP.resolve(null);
		}
	}
});

Balanced.CreditCreator.reopenClass({
	build: function(attributes) {
		return this.create({
			attributes: attributes
		});
	},

	fromCsvRow: function(object) {
		return this.create({
			csvFields: object
		});
	}
});
