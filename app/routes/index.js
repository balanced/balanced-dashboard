Balanced.IndexRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		var marketplaceUri = this.get('auth').getLastUsedMarketplaceUri();
		if (marketplaceUri) {
			this.transitionTo('transaction', marketplace);
		} else {
			this.transitionTo('marketplaces');
		}
	}
});
