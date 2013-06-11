Balanced.IndexRoute = Balanced.AuthRoute.extend({
    redirect: function () {
        this.transitionTo('marketplaces');
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
    setupController: function () {
        this.controllerFor('marketplace').set('content', null);
    }
});

Balanced.MarketplacesApplyRoute = Balanced.AuthRoute.extend({
    title: 'Apply for production access',
    model: function () {
        var uri = ENV.BALANCED.WWW + '/marketplaces/apply' + Balanced.MigrationUtils.embeddedQueryString();
        return {
            'uri': uri,
            'title': this.title
        };
    },
    setupController: function (controller, model) {
        this._super(controller, model);
        this.controllerFor('marketplace').set('content', null);
    }
});
