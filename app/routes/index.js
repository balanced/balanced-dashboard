Balanced.IndexRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		var marketplaceUri = this.get('auth').getLastUsedMarketplaceUri();
		if (marketplaceUri) {
			this.transitionTo('transactions', Balanced.Marketplace.find(marketplaceUri));
		} else {
			this.transitionTo('marketplaces');
		}
	}
});
