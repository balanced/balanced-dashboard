Balanced.MarketplaceRoute = Balanced.AuthRoute.extend({
    model: function (params) {
        var marketplaceURI = Balanced.Marketplace.constructUri(params.marketplace_id);

        //  set the most recently used marketplace so we can return to this at a later date
        Balanced.COOKIE.set(Balanced.COOKIE.MARKETPLACE_URI, marketplaceURI);

        return Balanced.Marketplace.find(marketplaceURI);
    },

    // if we passed a lite marketplace to #linkTo, need this to find the real marketplace
    setupController: function (controller, model) {
        this._super(controller, model);

        // Store the marketplace in a global so we can use it for auth. TAKE THIS OUT when we've moved to oAuth
        Balanced.currentMarketplace = model;
        if (model._type === 'marketplaceLite') {
            var realMarketplace = Balanced.Marketplace.find(model.uri);
            controller.set('content', realMarketplace);
            Balanced.currentMarketplace = realMarketplace;
        }
    }
});
