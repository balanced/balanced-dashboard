Balanced.MarketplaceDisputesRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Disputes',
	model: function() {
		var marketplace = this.modelFor("marketplace");
		return marketplace.getDisputesLoader({});
	},
});
