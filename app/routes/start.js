Balanced.StartRoute = Balanced.Route.extend({
    redirect: function () {
        var self = this;
        if (Balanced.Auth.get('user') && !Balanced.Auth.get('isGuest')) {
            self.transitionTo('index');
            return;
        }
        Balanced.Model.create({
            // TODO: get this from the api
            uri: '/v1/api_keys'
        }).create().then(function (apiKey) {
            Balanced.Auth.storeGuestAPIKey(apiKey.secret);

            Balanced.Marketplace.create({
                uri: '/v1/marketplaces'
            }).create().then(function (marketplace) {
                var marketplaces = Balanced.Auth.get('user').get('marketplaces');
                marketplaces.pushObject(Balanced.Marketplace.create(marketplace));
                self.transitionTo('marketplace.transactions', marketplace);
            });
        });
    }
});
