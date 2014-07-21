Balanced.MarketplacesIndexController = Balanced.ArrayController.extend(Ember.Evented, {
	needs: ['application'],

	testMarketplaces: Ember.computed.filterBy("auth.user.user_marketplaces", "production", false),
	productionMarketplaces: Ember.computed.filterBy("auth.user.user_marketplaces", "production", true),

	actions: {
		promptToDeleteMarketplace: function(marketplace) {
			this.trigger('openDeleteMarketplaceModal', marketplace);
		},
		goToMarketplace: function(marketplace) {
			this.transitionTo('marketplace', marketplace);
		}
	}
});
