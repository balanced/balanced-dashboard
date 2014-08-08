Balanced.BankAccountLinkIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: "Linking bank account to owner_customer",

	actions: {
		nextStep: function(bankAccount) {
			var controller = this.get("container").lookup("controller:application");
			var marketplace = this.get("marketplace");
			controller
				.send("openModal", Balanced.BankAccountVerificationCreateIntermediateStateModalView, marketplace, bankAccount);
		},
		save: function() {
			var self = this;
			var errors = this.get("errorMessages");
			errors.clear();

			var customerLink = this.get("marketplace.links.owner_customer");
			return this
				.get("bankAccount")
				.set("links.customer", customerLink)
				.save()
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
