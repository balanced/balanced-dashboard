Balanced.BankAccountVerificationCreateIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: "Creating bank account verification",

	getOwnerCustomerController: function() {
		return this.lookupController("controller:owner_customer_bank_account");
	},

	actions: {
		nextStep: function(marketplace) {
			this.get("container")
				.lookup("controller:application")
				.transitionToRoute("marketplace", marketplace);
		},

		save: function() {
			var self = this;
			var bankAccount = this.get("bankAccount");
			var marketplace = this.get("marketplace");

			this
				.execute(function() {
					return self.getOwnerCustomerController().verify(bankAccount);
				})
				.then(function(verification) {
					self.send("nextStep", marketplace);
				});
		}
	}
});
