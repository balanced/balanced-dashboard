Balanced.MarketplaceRoute = Balanced.AuthRoute.extend({
    model: function (params) {
        var marketplaceURI = Balanced.Marketplace.constructUri(params.marketplace_id);
        balanced.init(marketplaceURI);
        return Balanced.Marketplace.find(marketplaceURI);
    },

    // if we passed a lite marketplace to #linkTo, need this to find the real marketplace
    setupController: function (controller, model) {
        this._super(controller, model);

        Balanced.Utils.setCurrentMarketplace(model);
        if (model._type === 'marketplaceLite') {
            var realMarketplace = Balanced.Marketplace.find(model.uri);
            controller.set('content', realMarketplace);
            Balanced.Utils.setCurrentMarketplace(model);
        }
    }
});
