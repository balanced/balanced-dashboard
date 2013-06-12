
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
