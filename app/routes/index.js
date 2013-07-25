Balanced.IndexRoute = Balanced.AuthRoute.extend({
    redirect: function () {
        var marketplaceUri = $.cookie(Balanced.COOKIE.MARKETPLACE_URI);
        if (marketplaceUri) {
            this.transitionTo('activity', Balanced.Marketplace.find(marketplaceUri));
        } else {
            this.transitionTo('marketplaces');
        }
    }
});

Balanced.MarketplacesRoute = Balanced.AuthRoute.extend({
    setupController: function () {
        if (!Balanced.Auth.get('isGuest')) {
            return;
        }
        var guestUser = Balanced.Auth.get('user');
        //  get marketplaces so we have something to show
        Balanced.Marketplace.find('/v1/marketplaces').then(function (marketplaces) {
            if (!marketplaces.items.length) {
                return;
            }
            var guestMarketplace = Balanced.Marketplace.create({uri: marketplaces.items[0].uri});
            guestMarketplace.refresh();
            guestUser.get('marketplaces').pushObject(guestMarketplace);
        });

    }
});

Balanced.MarketplacesIndexRoute = Balanced.AuthRoute.extend({
    pageTitle: 'Marketplaces',
    
    setupController: function () {
        this.controllerFor('marketplace').set('content', null);
    }
});
