Balanced.ConfirmVerificationModalView = Balanced.ModalView.extend({
	templateName: 'modals/confirm_verification',
	controllerEventName: 'openConfirmVerificationModal',
	modalElement: '#confirm-verification',
	failedConfirmation: false,

	open: function() {
		this.set('failedConfirmation', false);
		this._super(this.get('funding_instrument.verification'));
	},

	errorSaving: function(error) {
		var verification = this.get('funding_instrument.verification');
		if (verification.get('errorCategoryCode') === "bank-account-authentication-failed") {
			this.set('failedConfirmation', true);
		}

		this.get('controller').reloadVerifications(verification);
	},

	amount_1_highlight: Balanced.computed.orProperties('failedConfirmation', 'model.validationErrors.amount_1'),
	amount_2_highlight: Balanced.computed.orProperties('failedConfirmation', 'model.validationErrors.amount_2')
});
