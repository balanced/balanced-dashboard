Balanced.BankAccountFindIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: function() {
		return "Finding Bank Account %@".fmt(this.get("bankAccountHref"));
	}.property("marketplaceHref"),

	actions: {
		nextStep: function(bankAccount) {
			var marketplace = this.get("marketplace");
			this.openNext(Balanced.BankAccountLinkIntermediateStateModalView, {
				marketplace: marketplace,
				bankAccount: bankAccount
			});
		},

		save: function() {
			var self = this;
			var controller = this.container.lookup("controller:owner_customer_bank_account");

			this
				.execute(function() {
					return controller.find(self.get("bankAccountHref"));
				})
				.then(function(bankAccount) {
					self.send("nextStep", bankAccount);
				});
		}
	}
});
