Balanced.LoginRoute = Balanced.Route.extend({
    redirect: function () {
        // if you're logged in, no reason to let you see the login page
        if (Balanced.Auth.get('userId')) {
            this.transitionTo('marketplaces');
        }
    }
});

Balanced.StartRoute = Balanced.Route.extend({
    redirect: function () {
        Balanced.Model.create({
            uri: '/v1/api_keys'
        }).create().then(function (apiKey) {
            Balanced.NET.ajaxHeaders['Authorization'] = 'Basic ' + window.btoa(apiKey.secret + ':');
            Balanced.Marketplace.create({
                uri: '/v1/marketplaces'
            }).create().then(function (marketplace) {
                //  Fake a login to keep EmberAuth happy
                Balanced.Auth.set('authToken', '/users/guest');
                Balanced.Auth.set('userId', '/users/guest');
                Balanced.Auth.set('signedIn', true);
                Balanced.Auth.set('isGuest', true);
                Balanced.Auth.set('user', Balanced.User.create());
                var location = '#' + marketplace.transactions_uri.substr('3');
                window.location = location;
            });
        });
    }
});

Ember.ValidationError.addMessages({
    'taken': 'is already in use'
});

/*
* Where we're at (for Monday :))
*
* We're submitting our user to the DB, we're trying to handle API based
* failures. Once that's done we just need to write tests.
*
 */
Balanced.ClaimController = Balanced.ObjectController.extend({
    error: function (field, prefix) {
        var errors = this.get('validationErrors.' + field + '.messages');
        if (errors) {
            return prefix + ' ' + errors[0];
        }
    },

    emailLabel: function () {
        return this.error('email', 'Email') || 'Enter your email';
    }.property('validationErrors.email'),

    passwordLabel: function () {
        return this.error('password', 'Password') || 'Create a password';
    }.property('validationErrors.password'),

    passwordConfirmLabel: function () {
        return this.error('passwordConfirm', 'Password') || 'Re-enter your password';
    }.property('validationErrors.passwordConfirm')
});

Balanced.ClaimRoute = Balanced.Route.extend({
    setupController: function (controller, model) {
        controller.set('content', Balanced.Claim.create({
            uri: '/users'
        }));
    },
    redirect: function () {
        var userId = Balanced.Auth.get('userId');
        // gone while developings
//        if (userId !== '/users/guest') {
//            this.transitionTo('index');
//        }
    },
    events: {
        signUp: function (model) {
            var self = this;
            if (!model.validate()) {
                return;
            }
            var addValidation = function (unparsedJson) {
                var json = JSON.parse(unparsedJson);
                for (var key in json) {
                    if (!json.hasOwnProperty(key)) {
                        continue;
                    }
                    model.get('validationErrors').add(key, key === 'email_address' ? 'taken' : 'invalid');
                }
                console.log('err', json);
                console.log(model.get('validationErrors'));
                console.log(model.get('validationErrors.allMessages'));
            };

            model.one('becameInvalid', addValidation);
            model.one('becameError', addValidation);
            model.create().then(function (user) {
                console.log('user', user);
            }, function () {
                console.log('we done goofed', arguments);
            });
//            this.transitionTo('index');
        },
        cancel: function () {
            this.transitionTo('index');
        }
    }
});
