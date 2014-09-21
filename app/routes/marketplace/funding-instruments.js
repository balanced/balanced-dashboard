import TitleRoute from "../title";

var MarketplaceFundingInstrumentsRoute = TitleRoute.extend({
	pageTitle: 'Payment methods',
	model: function() {
		var marketplace = this.modelFor("marketplace");
		return marketplace.getFundingInstrumentsLoader({});
	},
});

export default MarketplaceFundingInstrumentsRoute;
