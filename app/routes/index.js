Balanced.IndexRoute = Balanced.Route.extend({
    redirect: function () {
        var destination = Balanced.Auth.get('userId') ? 'marketplaces' : 'login';
        this.transitionTo(destination);
    }
});

Balanced.MarketplacesRoute = Balanced.AuthRoute.extend({

});

Balanced.MarketplacesIndexRoute = Balanced.AuthRoute.extend({
    setupController: function () {
        this.controllerFor('marketplace').set('content', null);
    }
});

Balanced.MarketplacesApplyRoute = Balanced.AuthRoute.extend({
    title: 'Apply for production access',
    model: function () {
        var uri = ENV.BALANCED.WWW + '/marketplaces/apply?embedded=1';
        return {
            'uri': uri,
            'title': this.title
        };
    },
    setupController: function () {
        this.controllerFor('marketplace').set('content', null);
    }
});
