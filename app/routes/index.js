Balanced.IndexRoute = Balanced.Route.extend({
    redirect: function () {
        var destination = Balanced.Auth.get('userId') ? 'marketplaces' : 'login';
        this.transitionTo(destination);
    }
});

Balanced.MarketplacesRoute = Balanced.AuthRoute.extend({

});

Balanced.MarketplacesIndexRoute = Balanced.AuthRoute.extend({

});
