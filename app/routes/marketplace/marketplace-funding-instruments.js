Balanced.MarketplaceFundingInstrumentsRoute = Balanced.TitleRoute.extend({
	pageTitle: 'Payment methods',
	model: function() {
		var marketplace = this.modelFor("marketplace");
		return marketplace.getFundingInstrumentsLoader({});
	},
});
