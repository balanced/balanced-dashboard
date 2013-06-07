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
                Balanced.Auth.set('user', Balanced.User.create());
                var location = '#' + marketplace.transactions_uri.substr('3');
                window.location = location;
            });
        });
    }
});
