import Ember from "ember";
import BankAccount from "balanced-dashboard/models/bank-account";
import Verification from "balanced-dashboard/models/verification";

var OwnerCustomerBankAccountController = Ember.Controller.extend({
	needs: ["marketplace"],
	find: function(bankAccountHref) {
		return BankAccount.find(bankAccountHref);
	},

	link: function(marketplace, bankAccount) {
		var customerLink = marketplace.get("links.owner_customer");
		bankAccount.set("links.customer", customerLink);
		return bankAccount.save();
	},

	verify: function(bankAccount) {
		return Verification
			.create({
				uri: bankAccount.get("bank_account_verifications_uri")
			})
			.save();
	},

	linkAndVerify: function(marketplace, bankAccountHref) {
		var self = this;
		return this
			.find(bankAccountHref)
			.then(function(bankAccount) {
				return self.link(marketplace, bankAccount);
			})
			.then(function(bankAccount) {
				return self.verify(bankAccount);
			})
			.then(function(a) {
				self.get("controllers.marketplace").updateBankAccountNotifications();
				return a;
			});
	},
});

export default OwnerCustomerBankAccountController;
