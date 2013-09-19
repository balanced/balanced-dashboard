Balanced.MarketplacesIndexController = Balanced.ArrayController.extend(Ember.Evented, {
	actions: {
		promptToDeleteMarketplace: function (marketplace) {
			this.trigger('openDeleteMarketplaceModal', marketplace);
		}
	}
});
