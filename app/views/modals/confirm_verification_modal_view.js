Balanced.Modals.ConfirmVerificationModalView = Balanced.ModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
	templateName: 'modals/confirm_verification_modal',
	elementId: 'confirm-verification',
	title: "Confirm your bank account",

	failedConfirmation: false,
	verification: Ember.computed.oneWay("bankAccount.verification"),

	errorSaving: function(error) {
		var verification = this.get('verification');
		if (verification.get('errorCategoryCode') === "bank-account-authentication-failed") {
			this.set('failedConfirmation', true);
		}
		verification.reload();
	},

	amount_1_highlight: Balanced.computed.orProperties('failedConfirmation', 'model.validationErrors.amount_1'),
	amount_2_highlight: Balanced.computed.orProperties('failedConfirmation', 'model.validationErrors.amount_2'),
	isSaving: false,
	actions: {
		save: function() {
			var self = this;
			self.set("isSaving", true);
			var verification = this.get("verification");
			verification
				.save()
				.then(function() {
					self.get("bankAccount").reload();
					self.setProperties({
						failedConfirmation: false,
						isSaving: false
					});
					self.close();
				}, function(errors) {
					self.errorSaving(errors);
					self.setProperties({
						failedConfirmation: true,
						isSaving: false
					});
				});
		}
	}
});

Balanced.Modals.ConfirmVerificationModalView.reopenClass({
	open: function(bankAccount) {
		return this.create({
			bankAccount: bankAccount
		});
	}
});
