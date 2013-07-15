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

            function persistMarketplace(user) {
                Balanced.Utils.setCurrentMarketplace(null);

                models.apiKey.create().then(function (apiKey) {
                    //  set the api key for this request
                    Balanced.Auth.setAPIKey(apiKey.get('secret'));

                    models.marketplace.create().then(function (marketplace) {
                        Balanced.Auth.unsetAPIKey();

                        // unset the api key for this request
                        //  associate to login
                        var userMarketplaceAssociation = Balanced.UserMarketplace.create({
                            uri: user.api_keys_uri,
                            secret: apiKey.secret
                        });
                        userMarketplaceAssociation.create().then(function () {
                            user.refresh();
                            //  we need the api key to be associated with the user before we can create the bank account
                            //  create bank account
                            var bankAccountUri = marketplace.get('owner_customer.bank_accounts_uri') + '?marketplace=' + marketplace.get('id');

                            models.bankAccount.set('uri', bankAccountUri);
                            models.bankAccount.create().then(function (bankAccount) {
                                // we don't know the bank account's
                                // verification uri until it's created so we
                                // are forced to create it here.
                                var verification = Balanced.Verification.create({
                                    uri: bankAccount.get('verifications_uri')
                                });
                                verification.create();
                            });
                        });

                        //  annnnd we're done
                        self.controllerFor('marketplace').send('alertMessage', {
                            type: 'success',
                            message: 'We\'ve received your information. In the ' +
                                'meantime, you may fund your balance with your ' +
                                'credit card to transact right away.'
                        });

                        self.transitionTo('marketplace.initial_deposit', marketplace);
                    });
                });
            }

            function persistUser() {
                var password = models.user.password;
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
            }

            if (models.user) {
                persistUser();
            } else {
                persistMarketplace(Balanced.Auth.get('user'));
            }

        }
    }
});
