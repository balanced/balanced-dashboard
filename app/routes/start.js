
Balanced.StartRoute = Balanced.Route.extend({
    redirect: function () {
        var self = this;
        Balanced.Model.create({
            uri: '/v1/api_keys'
        }).create().then(function (apiKey) {
            //  store in case page is refreshed
            $.cookie('apiKeySecret', apiKey.secret);
            //  use as a header for api access
            Balanced.NET.ajaxHeaders['Authorization'] = 'Basic ' + window.btoa(apiKey.secret + ':');

            Balanced.Marketplace.create({
                uri: '/v1/marketplaces'
            }).create().then(function (marketplace) {
                //  Fake a login to keep EmberAuth happy
                Balanced.Auth.set('authToken', apiKey.secret);
                Balanced.Auth.set('userId', '/users/guest');
                Balanced.Auth.set('signedIn', true);
                Balanced.Auth.set('isGuest', true);
                Balanced.Auth.set('user', Balanced.User.create());
                self.transitionTo('marketplace.transactions', marketplace);
            });
        });
    }
});
