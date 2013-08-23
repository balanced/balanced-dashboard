Balanced.ApplicationRoute = Balanced.Route.extend({
    init: function () {
        var self = this;
        // Have to use setTimeout to get around callback ordering issues in
        // ember-auth
        Balanced.Auth.on('signInSuccess', function () {
            setTimeout(function () {
                var intendedDestinationHash = Balanced.Auth.getIntendedDestinationHash();
                if (intendedDestinationHash) {
                    Balanced.Auth.clearIntendedDestinationHash();
                    window.location.hash = intendedDestinationHash;
                } else {
                    self.transitionTo('index');
                }
            });
        });
        Balanced.Auth.on('signOutSuccess', function () {
            setTimeout(function () {
                self.transitionTo('login');
            });
        });
    },
    events: {
        error: function(error, transition) {
            Ember.Logger.error('Error while loading route:', error.stack || error);

            if(error.isError && error.errorStatusCode === 401) {
                Balanced.Auth.trigger('authAccess');
                this.transitionTo('login');
            } else {
                this.transitionTo('index');
            }
        },
        signOut: function () {
            Balanced.Auth.signOut({
                xhrFields: {
                    withCredentials: true
                }
            });

        }
    }
});
