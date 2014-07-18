Balanced.MarketplaceTransactionsRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Transactions',
	model: function() {
		var marketplace = this.modelFor("marketplace");
		return Balanced.TransactionsResultsLoader.create({
			marketplace: marketplace
		});
	},
});
