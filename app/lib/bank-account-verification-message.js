import Ember from "ember";
import Customer from "balanced-dashboard/models/customer";
import Verification from "balanced-dashboard/models/verification";
import BankAccount from "balanced-dashboard/models/bank-account";
import ModelArray from "balanced-dashboard/models/core/model-array";

var MESSAGES = {
	noBankAccounts: {
		message: "Your marketplace is not linked to any bank accounts. Please add a bank account.",
		linkTo: "marketplace.settings",
		linkText: "Visit settings page"
	},
	noOpenVerification: {
		message: "You have unverified bank accounts. Please start a verification.",
		linkTo: "marketplace.settings",
		linkText: "Visit settings page"
	},
	openVerification: {
		message: "Please verify your marketplace bank account by confirming the deposit amounts.",
		linkTo: "marketplace.settings",
		linkText: "Visit settings page"
	}
};

// We need to handle 4 cases for bank account notification:
// 1. marketplace has a debitable bank account: no message
// 2. marketplace doesn't have any bank accounts: "please create and verify a bank account"
// 3. marketplace has a bank account with pending verification: "Please finish verification"
// 4. marketplace has bank accounts but no open verifications: "Please start verify process"
var BankAccountVerificationMessage = {
	MESSAGES: MESSAGES,
	forMarketplace: function(marketplace) {
		var self = this;
		var uri = marketplace.get("owner_customer_uri");
		if (marketplace.get("production") && !Ember.isBlank(uri)) {
			return Customer.find(uri)
				.then(function(customer) {
					return self.forCustomer(customer);
				});
		}
		return Ember.RSVP.resolve();

	},
	forCustomer: function(customer) {
		var self = this;
		var uri = customer.get("bank_accounts_uri");
		return ModelArray.newArrayLoadedFromUri(uri, BankAccount)
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
				return Verification.find(uri);
			});

		return Ember.RSVP.all(promises);
	},

};

export default BankAccountVerificationMessage;
