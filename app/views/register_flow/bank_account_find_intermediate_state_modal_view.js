Balanced.BankAccountFindIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: function() {
		return "Finding Bank Account %@".fmt(this.get("bankAccountHref"));
	}.property("marketplaceHref"),

	getOwnerCustomerController: function() {
		return this.lookupController("controller:owner_customer_bank_account");
	},

	actions: {
		nextStep: function(marketplace, bankAccount) {
			this.openNext(Balanced.BankAccountLinkIntermediateStateModalView, {
				marketplace: marketplace,
				bankAccount: bankAccount
			});
		},

		save: function() {
			var self = this;
			var controller = this.getOwnerCustomerController();
			var marketplace = this.get("marketplace");

			this
				.execute(function() {
					return controller.find(self.get("bankAccountHref"));
				})
				.then(function(bankAccount) {
					self.send("nextStep", marketplace, bankAccount);
				});
		}
	}
});
