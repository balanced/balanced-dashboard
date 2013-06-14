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
                    console.log('api key created');
                    console.log(apiKey.get('id'));
                    console.log(apiKey.get('secret'));
                    //  set the api key for this request
                    Balanced.Auth.setAPIKey(apiKey.get('secret'));
                    console.log('ok, now create marketplace');

                    models.marketplace.create().then(function (marketplace) {
                        console.log('marketplace created');
                        console.log(marketplace.get('name'), marketplace.get('id'));

                        Balanced.Auth.unsetAPIKey();

                        // unset the api key for this request
                        //  associate to login
                        var userMarketplaceAssociation = Balanced.MarketplaceLite.create({
                            uri: user.api_keys_uri,
                            secret: apiKey.secret
                        });
                        userMarketplaceAssociation.create().then(function () {
                            console.log('marketplace associated with user');
                            user.refresh();
                            //  we need the api key to be associated with the user before we can create the bank account
                            //  create bank account
                            var bankAccountUri = marketplace.get('owner_customer.bank_accounts_uri') + '?marketplace_guid=' + marketplace.get('id');
                            console.log('creating bank account', bankAccountUri);
                            models.bankAccount.set('uri', bankAccountUri);
                            models.bankAccount.create();
                        });

                        console.log('gtfo');
                        //  annnnd we're done
                        self.transitionTo('marketplace.index', marketplace);
                        console.log('fin');
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
