Balanced.IndexRoute = Balanced.AuthRoute.extend({
    redirect: function () {
        this.transitionTo('marketplaces');
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
        var uri = ENV.BALANCED.WWW + '/marketplaces/apply' + Balanced.MigrationUtils.EMBEDDED_QUERY_APPEND;
        return {
            'uri': uri,
            'title': this.title
        };
    },
    setupController: function () {
        this.controllerFor('marketplace').set('content', null);
    }
});
