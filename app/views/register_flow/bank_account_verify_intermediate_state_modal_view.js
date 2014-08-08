Balanced.BankAccountVerificationCreateIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: "Creating bank account verification",

	bankAccountVerificationsUri: Ember.computed.oneWay("bankAccount.bank_account_verifications_uri"),

	actions: {
		nextStep: function() {
			var controller = this.get("container").lookup("controller:application");
			controller.transitionToRoute("marketplace", this.get("marketplace"));
		},

		save: function() {
			var self = this;
			var errors = this.get("errorMessages");
			errors.clear();

			Balanced.Verification
				.create({
					uri: this.get("bankAccountVerificationsUri")
				})
				.save()
				.then(function(verification) {
					self.close();
					console.log(verification);
					self.send("nextStep");
				})
				.then(undefined, function(response) {
					errors.populate(response);
				});
		}
	}
});

Balanced.BankAccountVerificationCreateIntermediateStateModalView.reopenClass({
	open: function(marketplace, bankAccount) {
		var view = this.create({
			bankAccount: bankAccount,
			marketplace: marketplace
		});
		view.send("save");
		return view;
	}
});
