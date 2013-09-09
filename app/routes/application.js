Balanced.ApplicationRoute = Balanced.Route.extend({
	beforeModel: function() {
		if (window.TESTING || Balanced.Auth.get('signedIn')) {
			return;
		}

		var self = this;

		return $.ajax({
			type: 'POST',
			url: Ember.ENV.BALANCED.AUTH,
			xhrFields: {
				withCredentials: true
			}
		}).then(function(response, status, jqxhr) {
			var csrfToken = response.csrf;
			Balanced.NET.ajaxHeaders['X-CSRFToken'] = csrfToken;

			var authCookie = Balanced.Auth.retrieveLogin();
			if (authCookie) {
				return $.ajax('https://auth.balancedpayments.com/logins', {
					type: 'POST',
					xhrFields: {
						withCredentials: true
					},
					data: { uri: authCookie }
				}).success(function (response, status, jqxhr) {
					// set the auth stuff manually
					Balanced.Auth.setAuthProperties(
						true,
						Balanced.User.find(response.user_uri),
						response.user_id,
						response.user_id,
						false
					);
				});
			}
		});
	},

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
