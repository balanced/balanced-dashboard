
Balanced.StartRoute = Balanced.Route.extend({
    redirect: function () {
        var self = this;
        Balanced.Model.create({
            uri: '/v1/api_keys'
        }).create().then(function (apiKey) {
            Balanced.Auth.storeGuestAPIKey(apiKey.secret);

            Balanced.Marketplace.create({
                uri: '/v1/marketplaces'
            }).create().then(function (marketplace) {
                Balanced.Auth.get('user').get('marketplaces').pushObject(Balanced.Marketplace.create(marketplace));
                self.transitionTo('marketplace.transactions', marketplace);
            });
        });
    }
});
