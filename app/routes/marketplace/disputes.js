import AuthRoute from "../auth";

var MarketplaceDisputesRoute = AuthRoute.extend({
	pageTitle: 'Disputes',
	model: function() {
		var marketplace = this.modelFor("marketplace");
		return marketplace.getDisputesLoader({});
	},
});

export default MarketplaceDisputesRoute;
