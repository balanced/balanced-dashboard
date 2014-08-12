Balanced.BankAccountLinkIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: "Linking bank account to owner_customer",

	actions: {
		nextStep: function(bankAccount) {
			var marketplace = this.get("marketplace");
			this.openNext(Balanced.BankAccountVerificationCreateIntermediateStateModalView, {
				marketplace: marketplace,
				bankAccount: bankAccount
			});
		},
		save: function() {
			var self = this;
			var controller = this.container.lookup("controller:owner_customer_bank_accounr");
			var bankAccount = this.get("bankAccount");

			this
				.execute(function() {
					return controller.link(marketplace, bankAccount);
				})
				.then(function() {
					self.send("nextStep", bankAccount);
				});
		}
	}
});
