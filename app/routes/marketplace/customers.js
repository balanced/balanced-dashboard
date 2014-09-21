import AuthRoute from "../auth";

var MarketplaceCustomersRoute = AuthRoute.extend({
	pageTitle: 'Customers',
	model: function() {
		var marketplace = this.modelFor("marketplace");
		return marketplace.getCustomersLoader();
	},
});

export default MarketplaceCustomersRoute;
