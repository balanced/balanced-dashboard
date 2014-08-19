Balanced.OwnerCustomerBankAccountController = Balanced.Controller.extend({
	openModal: function() {
		var application = this.get("container").lookup("controller:application");
		var uri = this.get("container").lookup("controller:marketplace").get("marketplace.uri");
		application
			.send("openModal", Balanced.MarketplaceFindIntermediateStateModalView, {
				marketplaceHref: uri
			});
	},

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

	linkAndVerify: function(marketplace, bankAccountHref) {
		var self = this;
		return this
			.find(bankAccountHref)
			.then(function(bankAccount) {
				return self.link(marketplace, bankAccount)
			})
			.then(function(bankAccount) {
				return self.verify(bankAccount);
			});
	},
});
