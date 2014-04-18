Balanced.IndexRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		var marketplaceUri = this.get('auth').getLastUsedMarketplaceUri();
		if (marketplaceUri) {
			this.transitionTo('activity', Balanced.Marketplace.find(marketplaceUri));
		} else {
			this.transitionTo('marketplaces');
		}
	}
});

Balanced.MarketplacesIndexRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Marketplaces',

	redirect: function() {
		if (this.get('auth.isGuest') && Balanced.currentMarketplace) {
			this.transitionTo('marketplace', Balanced.currentMarketplace);
		}
	},

	setupController: function() {
		Balanced.Utils.setCurrentMarketplace(null);
		this.controllerFor('marketplace').set('content', null);
	}
});
