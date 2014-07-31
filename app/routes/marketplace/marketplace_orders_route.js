Balanced.MarketplaceOrdersRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Orders',
	model: function() {
		var marketplace = this.modelFor("marketplace");
		return marketplace.getOrdersLoader();
	},
});
