Balanced.TxnDebitComponent = Ember.Component.extend({
	show_funding_instrument_details: false,

	toggleFundingInstrumentDetails: function() {
		this.set('show_funding_instrument_details', !this.get('show_funding_instrument_details'));
	}
});