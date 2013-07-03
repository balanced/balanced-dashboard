Balanced.MarketplaceRoute = Balanced.AuthRoute.extend({
    model: function (params) {
        var marketplaceURI = Balanced.Marketplace.constructUri(params.marketplace_id);
        balanced.init(marketplaceURI);
        var marketplace = Balanced.Marketplace.find(marketplaceURI);
        Balanced.Utils.setCurrentMarketplace(marketplace);
        return marketplace;
    },

    // if we passed a marketplace to #linkTo, need this to set current marketplace
    setupController: function (controller, model) {
        this._super(controller, model);

        Balanced.Utils.setCurrentMarketplace(model);
    }
});
