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
