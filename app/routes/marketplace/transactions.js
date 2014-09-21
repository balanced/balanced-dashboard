import AuthRoute from "../auth";

var MarketplaceTransactionsRoute = AuthRoute.extend({
	pageTitle: 'Transactions',
	model: function() {
		var marketplace = this.modelFor("marketplace");
		return marketplace.getTransactionsLoader();
	},
});

export default MarketplaceTransactionsRoute;
