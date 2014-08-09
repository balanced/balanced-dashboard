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
			var verification = Balanced.Verification.create({
				uri: this.get("bankAccountVerificationsUri")
			});

			this
				.execute(function() {
					return verification.save();
				})
				.then(function(verification) {
					self.send("nextStep");
				});
		}
	}
});
