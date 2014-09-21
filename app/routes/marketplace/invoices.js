import AuthRoute from "../auth";

var MarketplaceInvoicesRoute = AuthRoute.extend({
	pageTitle: 'Account statements',
	model: function() {
		var marketplace = this.modelFor("marketplace");
		return marketplace.getInvoicesLoader();
	},
});

export default MarketplaceInvoicesRoute;
