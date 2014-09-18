Balanced.CreditFundingInstrumentModalView = Balanced.FundingInstrumentModalView.extend({
	templateName: 'modals/credit_funding_instrument',
	controllerEventName: 'openCreditFundingInstrumentModal',
	modalElement: '#credit-funding-instrument',

	open: function() {
		var credit = Balanced.Credit.create({
			uri: this.get('funding_instrument.credits_uri'),
			source_uri: this.get('funding_instrument.uri'),
			amount: null
		});

		this._super(credit);
	}
});
