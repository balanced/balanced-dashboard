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
        signOut: function () {
            Balanced.Auth.signOut({
                xhrFields: {
                    withCredentials: true
                }
            });
        }
    }
});
