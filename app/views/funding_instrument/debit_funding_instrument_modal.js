Balanced.DebitFundingInstrumentModalView = Balanced.FundingInstrumentModalView.extend({
	templateName: 'modals/debit_funding_instrument',
	controllerEventName: 'openDebitFundingInstrumentModal',
	modalElement: '#debit-funding-instrument',

	open: function() {
		var debit = Balanced.Debit.create({
			uri: this.get('funding_instrument.debits_uri'),
			source_uri: this.get('funding_instrument.uri'),
			amount: null
		});

		this._super(debit);
	}
});
