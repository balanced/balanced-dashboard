Balanced.MarketplaceOrdersRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Orders',
	model: function() {
		var marketplace = this.modelFor("marketplace");
		return Balanced.OrdersResultsLoader.create({
			marketplace: marketplace
		});
	},
});
