Balanced.OwnerCustomerBankAccountController = Balanced.Controller.extend({
	find: function(bankAccountHref) {
		return Balanced.BankAccount.find(bankAccountHref);
	},

	link: function(marketplace, bankAccount) {
		var customerLink = marketplace.get("links.owner_customer");
		bankAccount.set("links.customer", customerLink);
		return bankAccount.save();
	},

	verify: function(bankAccount) {
		return Balanced.Verification
			.create({
				uri: bankAccount.get("bank_account_verifications_uri")
			})
			.save();
	},
});
