import AuthRoute from "../auth";

var MarketplaceLogsRoute = AuthRoute.extend({
	pageTitle: 'Logs',
	model: function() {
		var marketplace = this.modelFor("marketplace");
		return marketplace.getLogsLoader();
	},
});

export default MarketplaceLogsRoute;
