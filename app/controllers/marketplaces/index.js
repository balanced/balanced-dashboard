Balanced.MarketplacesIndexController = Balanced.ArrayController.extend(Ember.Evented, {
    promptToDeleteMarketplace: function (marketplace) {
        this.trigger('openDeleteMarketplaceModal', marketplace);
    }
});
