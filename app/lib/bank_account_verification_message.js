var MESSAGES = {
	noBankAccounts: "Your marketplace is not linked to any bank accounts. Add a bank account by visiting the settings page.",
	noOpenVerification: "You have unverified bank accounts. Start a verification by visiting the settings page.",
	openVerification: "Please verify your marketplace bank account by confirming the deposit amounts."
};

// We need to handle 4 cases for bank account notification:
// 1. marketplace doesn't have any bank accounts: "please create and verify a bank account"
// 2. marketplace has a debitable bank account: no message
// 3. marketplace has a bank account with pending verification: "Please finish verification"
// 4. marketplace has bank accounts but no open verifications: "Please start verify process"
Balanced.BankAccountVerificationMessage = {
	forMarketplace: function(marketplace) {
		var self = this;
		var uri = marketplace.get("owner_customer_uri");
		if (marketplace.get("production") && !Ember.isBlank(uri)) {
			return Balanced.Customer.find(uri)
				.then(function(customer) {
					return self.forCustomer(customer);
				});
		}
		return Ember.RSVP.resolve();

	},
	forCustomer: function(customer) {
		var self = this;
		var uri = customer.get("bank_accounts_uri");
		return Balanced.ModelArray.newArrayLoadedFromUri(uri, Balanced.BankAccount)
			.then(function(bankAccounts) {
				return self.forBankAccounts(bankAccounts);
			});
	},
	forBankAccounts: function(bankAccounts) {
		var self = this;
		if (bankAccounts.get("length") === 0) {
			return Ember.RSVP.resolve(MESSAGES.noBankAccounts);
		}
		if (bankAccounts.findBy("can_debit")) {
			return Ember.RSVP.resolve();
		}
		return this.loadAllBankAccountsVerifications(bankAccounts)
			.then(function(verifications) {
				return self.forVerifications(verifications);
			});

	},
	forVerifications: function(verifications) {
		if (verifications.isAny("isVerifiable")) {
			return Ember.RSVP.resolve(MESSAGES.openVerification);
		} else {
			return Ember.RSVP.resolve(MESSAGES.noOpenVerification);
		}
	},
	loadAllBankAccountsVerifications: function(bankAccounts) {
		var promises = bankAccounts
			.map(function(bankAccount) {
				return bankAccount.get("bank_account_verification_uri");
			})
			.compact()
			.map(function(uri) {
				return Balanced.Verification.find(uri);
			});

		return Ember.RSVP.all(promises);
	},

};
