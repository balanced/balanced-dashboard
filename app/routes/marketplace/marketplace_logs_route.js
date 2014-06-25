Balanced.MarketplaceLogsRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Logs',
	model: function() {
		var marketplace = this.modelFor("marketplace");
		return Balanced.LogsResultsLoader.create({
			marketplace: marketplace
		});
	},
});
