Balanced.MarketplacesIndexController = Balanced.ArrayController.extend(Ember.Evented, {
	needs: ['application'],
	actions: {
		promptToDeleteMarketplace: function(marketplace) {
			this.trigger('openDeleteMarketplaceModal', marketplace);
		},
		goToMarketplace: function(marketplace) {
			this.transitionTo('marketplace', marketplace);
		}
	}
});
