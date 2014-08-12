Balanced.BankAccountVerificationCreateIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: "Creating bank account verification",

	actions: {
		nextStep: function() {
			this.get("container")
				.lookup("controller:application")
				.transitionToRoute("marketplace", this.get("marketplace"));
		},

		save: function() {
			var self = this;
			var bankAccount = this.get("bankAccount");
			var controller = this.get("container")
				.lookup("controller:owner_customer_bank_account");

			this
				.execute(function() {
					return controller.verify(bankAccount);
				})
				.then(function(verification) {
					self.send("nextStep");
				});
		}
	}
});
