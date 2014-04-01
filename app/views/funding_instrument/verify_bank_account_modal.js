Balanced.VerifyBankAccountModalView = Balanced.ModalView.extend({
	templateName: 'modals/verify_bank_account',
	controllerEventName: 'openVerifyBankAccountModal',
	modalElement: '#verify-bank-account',

	open: function() {
		var verification = Balanced.Verification.create({
			uri: this.get('funding_instrument.bank_account_verifications_uri')
		});

		this._super(verification);
	}
});
