Balanced.IndexRoute = Balanced.Route.extend({
    redirect: function () {
        this.transitionTo('marketplaces');
    }
});

Balanced.MarketplacesRoute = Balanced.AuthRoute.extend({

});

Balanced.MarketplacesIndexRoute = Balanced.AuthRoute.extend({

});
