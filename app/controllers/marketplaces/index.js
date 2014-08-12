Balanced.MarketplacesIndexController = Balanced.ArrayController.extend(Ember.Evented, {
	needs: ['application'],

	testMarketplaces: Ember.computed.filterBy("auth.user.user_marketplaces", "production", false),
	productionMarketplaces: Ember.computed.filterBy("auth.user.user_marketplaces", "production", true),

	actions: {
		goToMarketplace: function(marketplace) {
			this.transitionTo('marketplace', marketplace);
		}
	}
});
