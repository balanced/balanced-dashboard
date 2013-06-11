Balanced.ClaimRoute = Balanced.Route.extend({
    model: function () {
        var claim = Balanced.Claim.create({
            uri: '/users'
        });
        return {
            claim: claim
        };
    },
    setupController: function (controller, model) {
        controller.set('content', model.claim);
    },
    redirect: function () {
        var userId = Balanced.Auth.get('userId');
        // gone while developings
        if (userId !== '/users/guest') {
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

            var parseResponse = function (unparsedJson) {
                var json = JSON.parse(unparsedJson);
                for (var key in json) {
                    if (!json.hasOwnProperty(key)) {
                        continue;
                    }
                    model.get('validationErrors').add(key, 'invalid', null, json[key]);
                }
                model.propertyDidChange('validationErrors');
            };

            model.one('becameInvalid', parseResponse);
            model.one('becameError', parseResponse);
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
                        var marketplace = Balanced.MarketplaceLite.create({
                            uri: user.api_keys_uri,
                            secret: authToken
                        });
                        marketplace.create().then(function () {
                            user.refresh();
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
