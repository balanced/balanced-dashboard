Balanced.ApplicationRoute = Balanced.Route.extend({
	init: function() {
		var self = this;
		Balanced.Auth.on('signInSuccess', function() {
			setTimeout(function () {
				self.transitionTo('index');
			});
		});
		Balanced.Auth.on('signOutSuccess', function() {
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
