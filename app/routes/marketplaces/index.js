Balanced.MarketplaceIndexRoute = Balanced.AuthRoute.extend({
    model: function (params) {
        return this.modelFor('marketplace');
    },

    // if we passed a lite marketplace to #linkTo, need this to find the real marketplace
    setupController: function (controller, model) {
        if (model._type === 'marketplaceLite') {
            controller.set('content', Balanced.Marketplace.find(model.uri));
        }
    }
});
