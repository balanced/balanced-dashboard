Balanced.BankAccountFindIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: function() {
		return "Finding Bank Account %@".fmt(this.get("bankAccountHref"));
	}.property("marketplaceHref"),

	actions: {
		nextStep: function(bankAccount) {
			var marketplace = this.get("marketplace");
			this.openNext(Balanced.BankAccountLinkIntermediateStateModalView, marketplace, bankAccount);
		},

		save: function() {
			var self = this;

			this
				.execute(function() {
					return Balanced.BankAccount.find(self.get("bankAccountHref"));
				})
				.then(function(bankAccount) {
					self.send("nextStep", bankAccount);
				});
		}
	}
});

Balanced.BankAccountFindIntermediateStateModalView.reopenClass({
	open: function(marketplace, bankAccountHref) {
		var view = this.create({
			marketplace: marketplace,
			bankAccountHref: bankAccountHref
		});
		view.send("save");
		return view;
	}
});
