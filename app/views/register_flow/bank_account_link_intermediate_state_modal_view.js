Balanced.BankAccountLinkIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: "Linking bank account to owner_customer",

	actions: {
		nextStep: function(bankAccount) {
			var marketplace = this.get("marketplace");
			this.openNext(Balanced.BankAccountVerificationCreateIntermediateStateModalView, marketplace, bankAccount);
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
				.then(function(bankAccount) {
					self.send("nextStep", bankAccount);
				});
		}
	}
});

Balanced.BankAccountLinkIntermediateStateModalView.reopenClass({
	open: function(marketplace, bankAccount) {
		var view = this.create({
			marketplace: marketplace,
			bankAccount: bankAccount
		});
		view.send("save");
		return view;
	}
});
