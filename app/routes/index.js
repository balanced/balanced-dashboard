Balanced.IndexRoute = Balanced.AuthRoute.extend({
    redirect: function () {
        if($.cookie('mru')) {
            this.transitionTo('marketplace.transactions', Balanced.Marketplace.find($.cookie('mru')));
        } else {
            this.transitionTo('marketplaces');
        }
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
    setupController: function (controller, model) {
        this._super(controller, model);
        this.controllerFor('marketplace').set('content', null);
    }
});
