Balanced.BankAccountLinkIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: "Linking bank account to owner_customer",

	getOwnerCustomerController: function() {
		return this.lookupController("controller:owner_customer_bank_account");
	},

	actions: {
		nextStep: function(marketplace, bankAccount) {
			this.openNext(Balanced.BankAccountVerificationCreateIntermediateStateModalView, {
				marketplace: marketplace,
				bankAccount: bankAccount
			});
		},
		save: function() {
			var self = this;
			var controller = this.getOwnerCustomerController();
			var bankAccount = this.get("bankAccount");
			var marketplace = this.get("marketplace");

			this
				.execute(function() {
					return controller.link(marketplace, bankAccount);
				})
				.then(function() {
					self.send("nextStep", marketplace, bankAccount);
				});
		}
	}
});
