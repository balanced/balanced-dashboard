Balanced.MarketplacesApplyRoute = Balanced.Route.extend({
    title: 'Apply for production access',
    model: function () {
        var request = Balanced.ProductionAccessRequest.create({

        });
        return {
            request: request,
            title: this.title
        };
    },
    setupController: function (controller, model) {
        this._super(controller, model.request);
        this.controllerFor('marketplace').set('content', null);
    },
    events: {
        signup: function (models) {
            var self = this;

            console.log('welcome to the machine');

            function persistMarketplace(user) {
                models.apiKey.create().then(function (apiKey) {
                    models.marketplace.create().then(function (marketplace) {
                        //  associate to login
                        var userMarketplaceAssociation = Balanced.MarketplaceLite.create({
                            uri: user.api_keys_uri,
                            secret: apiKey.secret
                        });
                        userMarketplaceAssociation.create();

                        //  create bank account
                        models.bankAccount.set('uri', marketplace.owner_customer.bank_accounts_uri);
                        models.bankAccount.create();

                        //  annnnd we're done
                        self.transitionTo('marketplace.settings', marketplace);
                    });
                });
            }

            if (models.user) {
                var password = models.user.password;
                console.log('we have a user')
                models.user.create().then(function (user) {
                    //  create new login
                    var login = Balanced.Login.create({
                        email_address: user.email_address,
                        password: password
                    });
                    login.create().then(function (login) {
                        Balanced.Auth.manualLogin(user, login);
                        persistMarketplace(Balanced.Auth.get('user'));
                    });
                });
            } else {
                persistMarketplace(Balanced.Auth.get('user'));
            }

        }
    }
});
