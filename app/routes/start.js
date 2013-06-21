Balanced.StartRoute = Balanced.Route.extend({
    model: function () {
        var apiKey = Balanced.Model.create({
                // TODO: get this from the api
                uri: '/v1/api_keys'
            }),
            marketplace = Balanced.Marketplace.create({
                uri: '/v1/marketplaces'
            });
        var models = {
            apiKey: apiKey,
            marketplace: marketplace
        };
        apiKey.create().then(function (apiKey) {
            Balanced.Auth.storeGuestAPIKey(apiKey.secret);
            marketplace.then(function (marketplace) {
                var marketplaces = Balanced.Auth.get('user').get('marketplaces');
                marketplaces.pushObject(Balanced.Marketplace.create(marketplace));
            });
        });
        return models;
    },
    events: {
        goToDashboard: function () {
            console.log(this.currentModel.marketplace);
            this.transitionTo('marketplace.index', this.currentModel.marketplace);
        },
        goToDocumentation: function () {
            window.location = 'https://docs.balancedpayments.com';
        },
        goToApply: function () {
            this.transitionTo('marketplaces.apply');
        }
    }
});
