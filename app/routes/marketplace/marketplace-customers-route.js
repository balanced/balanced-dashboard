Balanced.MarketplaceCustomersRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Customers',
	model: function() {
		var marketplace = this.modelFor("marketplace");
		return marketplace.getCustomersLoader();
	},
});
