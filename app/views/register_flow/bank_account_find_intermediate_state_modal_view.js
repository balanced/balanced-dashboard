Balanced.BankAccountFindIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: function() {
		return "Finding Bank Account %@".fmt(this.get("bankAccountHref"));
	}.property("marketplaceHref"),

	actions: {
		nextStep: function(bankAccount) {
			var marketplace = this.get("marketplace");
			var controller = this.get("container").lookup("controller:application");
			controller
				.send("openModal", Balanced.BankAccountLinkIntermediateStateModalView, marketplace, bankAccount);
		},
		save: function() {
			var self = this;
			var errors = this.get("errorMessages");
			errors.clear();

			return Balanced.BankAccount
				.find(this.get("bankAccountHref"))
				.then(function(bankAccount) {
					self.close();
					self.send("nextStep", bankAccount);
				})
				.then(undefined, function(response) {
					errors.populate(response);
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
