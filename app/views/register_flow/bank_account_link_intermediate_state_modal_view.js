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

			var customerLink = this.get("marketplace.links.owner_customer");
			var bankAccount = this.get("bankAccount");
			bankAccount.set("links.customer", customerLink);

			this
				.execute(function() {
					return bankAccount.save();
				})
				.then(function() {
					self.send("nextStep", bankAccount);
				});
		}
	}
});
