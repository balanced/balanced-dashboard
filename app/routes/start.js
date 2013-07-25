Balanced.StartRoute = Balanced.Route.extend({
    page_title: 'Getting started',
    
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
            marketplace: marketplace
        };
        var onMarketplaceCreate = function (mkt) {
            var marketplaces = Balanced.Auth.get('user').get('marketplaces');
            marketplaces.pushObject(Balanced.Marketplace.create(mkt));
            marketplace.refresh();

            //  pre-populate marketplace with transactions
            var id = mkt.uri.substr(mkt.uri.lastIndexOf('/') + 1);
            var uri = '/marketplaces/{0}/spam'.format(id);
            Balanced.Model.create({
                uri: uri
            }).update();
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
            this.transitionTo('index');
        }
    },
    events: {
        goToDashboard: function () {
            this.transitionTo('activity', this.currentModel.marketplace);
        },
        goToDocumentation: function () {
            window.location = 'https://docs.balancedpayments.com';
        },
        goToApply: function () {
            this.transitionTo('marketplaces.apply');
        },
        goToLogin: function () {
            // Since we already logged them in as guest, log them out so they can sign in as themselves
            Balanced.Auth.destroyGuestUser();
            Balanced.Auth.manualLogout();
            this.transitionTo('login');
        }
    }
});
