Balanced.ApplicationRoute = Balanced.Route.extend({
	events: {
		error: function(error, transition) {
			Ember.Logger.error("Error while loading route (%@: %@): ".fmt(error.errorStatusCode, error.uri), error.stack || error);

			// if we had a problem loading the marketplace, check that it's not the current
			// marketplace, since that might send us into an infinite loop
			if(error.get('uri') === $.cookie(Balanced.COOKIE.MARKETPLACE_URI)) {
				$.removeCookie(Balanced.COOKIE.MARKETPLACE_URI, { path: '/' });
			}

			Balanced.Analytics.trackEvent('route-error', {
				type: 'error-loading-route',
				location: window.location.toString(),
				statusCode: error.errorStatusCode
			});

			if(error.isError && (error.errorStatusCode === 401 || error.errorStatusCode === 403)) {
				if(transition) {
					Balanced.Auth.set('attemptedTransition', transition);
				}

				// If we're not authorized, need to log in (maybe as a different user),
				// so let's log out
				Balanced.Auth.forgetLogin();
				this.transitionTo('login');
			} else {
				this.transitionTo('index');
			}
		},

		signOut: function () {
			var self = this;
			Balanced.Auth.signOut({
				xhrFields: {
					withCredentials: true
				}
			}).then(function() {
				self.transitionTo('login');
			});
		}
	}
});
