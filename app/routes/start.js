Balanced.StartRoute = Balanced.Route.extend({
    model: function () {
        var existingApiKey = $.cookie(Balanced.COOKIE.API_KEY_SECRET);
        var apiKey = existingApiKey ? Balanced.APIKey.current() : Balanced.APIKey.create({
                // TODO: get this from the api
                uri: '/v1/api_keys'
            }),
            marketplace = existingApiKey ? Balanced.Marketplace.current() : Balanced.Marketplace.create({
                uri: '/v1/marketplaces'
            });

        var models = {
            apiKey: apiKey,
            marketplace: marketplace,
            headerClass: 'noShow'
        };
        var onMarketplaceCreate = function (mkt) {
            var marketplaces = Balanced.Auth.get('user').get('marketplaces');
            marketplaces.pushObject(Balanced.Marketplace.create(mkt));
            marketplace.refresh();
        }, onApiKeyCreate = function (apiKey) {
            Balanced.Auth.storeGuestAPIKey(apiKey.secret);
            marketplace.create().then(onMarketplaceCreate);
        };

        if (!existingApiKey) {
            apiKey.create().then(onApiKeyCreate);
        }
        return models;
    },
    redirect: function () {
        if (Balanced.Auth.get('user') && !Balanced.Auth.get('isGuest')) {
            this.transitionTo('marketplaces');
        }
    },
    events: {
        goToDashboard: function () {
            this.transitionTo('marketplace.activity', this.currentModel.marketplace);
        },
        goToDocumentation: function () {
            window.location = 'https://docs.balancedpayments.com';
        },
        goToApply: function () {
            this.transitionTo('marketplaces.apply');
        }
    }
});
