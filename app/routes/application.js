Balanced.ApplicationRoute = Balanced.Route.extend({
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
