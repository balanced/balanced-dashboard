Balanced.MarketplacesController = Balanced.ArrayController.extend({
    needs: 'marketplace',
    marketplaceBinding: 'controllers.marketplace'
});

Balanced.MarketplacesIndexController = Balanced.ArrayController.extend({

    isLoading: false,

    promptToDeleteMarketplace: function (marketplace) {
        this.marketplace = marketplace;
        $('#delete-marketplace').modal('show');
    },

    deleteMarketplace: function () {
        //  let's construct a uri even tho that's a little horrid. the reason
        // for doing so is we generally (except for this single case), deal
        // with api based uris
        var user = Balanced.Auth.get('user');
        var uri = user.marketplaces_uri + '/' + this.marketplace.get('id');
        Balanced.MarketplaceLite.create({
            uri: uri
        }).delete();
        user.marketplaces.removeObject(this.marketplace);
        $('#delete-marketplace').modal('hide');
    },

    addMarketplace: function (marketplace) {
        var self = this;
        this.set('isLoading', true);
        marketplace.one('didCreate', function () {
            Balanced.Auth.get('user').marketplaces.addObject(marketplace);
            self.reset();
        }).one('didError', function () {
            self.reset();
        });
        marketplace.create();
    },

    reset: function () {
        this.set('isLoading', false);
    }

});
