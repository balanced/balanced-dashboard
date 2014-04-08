Balanced.CreditBankAccountModalView = Balanced.FundingInstrumentModalView.extend({
	templateName: 'modals/credit_bank_account',
	controllerEventName: 'openCreditBankAccountModal',
	modalElement: '#credit-bank-account',

	open: function() {
		var credit = Balanced.Credit.create({
			uri: this.get('funding_instrument.credits_uri'),
			bank_account_uri: this.get('funding_instrument.uri'),
			amount: null
		});

		this._super(credit);
	}
});
