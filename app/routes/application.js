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
        },

        selectResult: function (obj) {
            var self = this;
            if (obj.constructor === Balanced.Account) {
                var marketplace = this.modelFor('marketplace');
                var accountId = obj.get('id');
                obj = marketplace.then(function(marketplace) {
                    var customerUri = marketplace.get('customers_uri') + '/' + accountId;
                    self.transitionTo('customer', Balanced.Customer.find(customerUri));
                });
                return;
            }

            if (obj.constructor === Balanced.Customer) {
                this.transitionTo('customer', obj);
                return;
            }

            window.location.hash = '#' + Balanced.Utils.uriToDashboardFragment(obj.uri);
        },
    }
});
