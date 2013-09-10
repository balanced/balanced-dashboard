Balanced.ApplicationRoute = Balanced.Route.extend({
	beforeModel: function() {
		if (window.TESTING || Balanced.Auth.get('signedIn')) {
			return;
		}

		return Balanced.NET.loadCSRFToken().then(function(response, status, jqxhr) {
			return Balanced.Auth.rememberMeSignIn();
		});
	},

	events: {
		error: function(error, transition) {
			// the error object could be an ember object or a jqxhr
			var statusCode = error.errorStatusCode || error.status;

			Ember.Logger.error("Error while loading route (%@: %@): ".fmt(statusCode, error.uri), error.stack || error);

			// if we had a problem loading the marketplace, check that it's not the current
			// marketplace, since that might send us into an infinite loop
			if(error.get && error.get('uri') === $.cookie(Balanced.COOKIE.MARKETPLACE_URI)) {
				$.removeCookie(Balanced.COOKIE.MARKETPLACE_URI, { path: '/' });
			}

			Balanced.Analytics.trackEvent('route-error', {
				type: 'error-loading-route',
				location: window.location.toString(),
				statusCode: statusCode
			});

			if(statusCode === 401 || statusCode === 403) {
				if(error.get && error.get('uri')) {
					// if we loaded an ember object and got a 401/403, let's forget about the transition
					Balanced.Auth.set('attemptedTransition', null);
					this.transitionTo('index');
				} else if(transition) {
					Balanced.Auth.set('attemptedTransition', transition);

					// If we're not authorized, need to log in (maybe as a different user),
					// so let's log out
					Balanced.Auth.forgetLogin();
					this.transitionTo('login');
				}
			} else {
				this.transitionTo('index');
			}
		},

		signOut: function () {
			var self = this;
			Balanced.Auth.signOut().then(function() {
				self.transitionTo('login');
			});
		}
	}
});
