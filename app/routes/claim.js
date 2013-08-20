Balanced.ClaimRoute = Balanced.Route.extend({

    parseResponse: function (unparsedJson) {
        var json = JSON.parse(unparsedJson);
        for (var key in json) {
            if (!json.hasOwnProperty(key)) {
                continue;
            }
            this.get('validationErrors').add(key, 'invalid', null, json[key]);
        }
        this.propertyDidChange('validationErrors');
    },

    model: function () {
        var claim = Balanced.Claim.create({
            uri: '/users'
        });

        claim.one('becameInvalid', $.proxy(this.parseResponse, claim));
        claim.one('becameError', $.proxy(this.parseResponse, claim));

        return {
            claim: claim
        };
    },

    setupController: function (controller, model) {
        controller.set('content', model.claim);
    },

    redirect: function () {
        if (!Balanced.Auth.get('isGuest')) {
            this.transitionTo('index');
        }
    },

    events: {
        signUp: function (someShitThatsNotTheModel, event) {
            var self = this;
            var model = this.currentModel.claim;
            var authToken = Balanced.Auth.get('authToken');

            //  bug in ember-validation requires this extra check for length
            if (!model.validate() && model.get('validationErrors.length')) {
                return;
            }

            model.create().then(function (user) {
                //  create a login
                var login = Balanced.Login.create({
                    email_address: user.get('email_address'),
                    password: user.get('passwordConfirm')
                });
                login.create().then(function (login) {
                    Balanced.Auth.manualLogin(user, login);

                    // associate marketplace to user
                    if (authToken) {
                        var marketplace = Balanced.UserMarketplace.create({
                            uri: user.api_keys_uri,
                            secret: authToken
                        });
                        marketplace.create().then(function () {
                            user.reload();
                        });
                    }
                });

                self.transitionTo('index');
            });
        },

        cancel: function () {
            this.transitionTo('index');
        }
    }
});
