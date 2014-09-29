import AuthRoute from "../auth";

var MarketplaceDisputesRoute = AuthRoute.extend({
	pageTitle: 'Disputes',
	model: function() {
		var marketplace = this.modelFor("marketplace");
		var attributes = this.getProperties("startTime", "endTime");
		return marketplace.getDisputesLoader(attributes);
	},
});

export default MarketplaceDisputesRoute;
