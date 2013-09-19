Balanced.TxnFundingInstrumentComponent = Ember.Component.extend({
	show_funding_instrument_details: false,

	actions: {
		toggleFundingInstrumentDetails: function() {
			this.set('show_funding_instrument_details', !this.get('show_funding_instrument_details'));
		}
	}
});
