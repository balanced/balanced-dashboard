var INFINITE_LOOP_DURATION_MILLIS = 2500;
var INFINITE_LOOP_NUM_ERRORS = 5;

Balanced.ApplicationRoute = Balanced.Route.extend({
	init: function() {
		this.set('errorTimestamps', []);
	},

	beforeModel: function() {
		if (window.TESTING || Balanced.Auth.get('signedIn')) {
			return;
		}

		return Balanced.NET.loadCSRFTokenIfNotLoaded(function() {
			return Balanced.Auth.rememberMeSignIn();
		});
	},

	actions: {
		error: function(error, transition) {
			if (!window.TESTING) {
				// Check for an infinite loop of error handling and short-circuit
				// if we've seen too many errors in too short a period
				var errorTimestamps = this.get('errorTimestamps');
				var currentTimestamp = new Date().getTime();
				errorTimestamps.push(currentTimestamp);
				if (errorTimestamps.length > INFINITE_LOOP_NUM_ERRORS) {
					var filtered = _.filter(errorTimestamps, function(t) {
						return t > currentTimestamp - INFINITE_LOOP_DURATION_MILLIS;
					});
					this.set('errorTimestamps', filtered);
					if (filtered.length > INFINITE_LOOP_NUM_ERRORS) {
						Balanced.Auth.forgetLogin();
						this.transitionTo('login');
						return;
					}
				}
			}

			// the error object could be an ember object or a jqxhr
			var statusCode = error.errorStatusCode || error.status;

			Ember.Logger.error("Error while loading route (%@: %@): ".fmt(statusCode, error.uri), error.stack || error);

			// if we had a problem loading the marketplace, check that it's not the current
			// marketplace, since that might send us into an infinite loop
			if (error.get && error.get('uri') === Balanced.Auth.getLastUsedMarketplaceUri()) {
				Balanced.Auth.forgetLastUsedMarketplaceUri();
			}

			Balanced.Analytics.trackEvent('route-error', {
				type: 'error-loading-route',
				location: window.location.toString(),
				statusCode: statusCode
			});

			if (statusCode === 401 || statusCode === 403) {
				if (error.get && error.get('uri')) {
					// if we loaded an ember object and got a 401/403, let's forget about the transition
					Balanced.Auth.set('attemptedTransition', null);
					this.controllerFor('application').alert({
						message: 'You are not permitted to access this resource.',
						type: 'error',
						persists: true
					});
					this.transitionTo('marketplaces');
				} else if (transition) {
					Balanced.Auth.set('attemptedTransition', transition);

					// If we're not authorized, need to log in (maybe as a different user),
					// so let's log out
					Balanced.Auth.forgetLogin();
					this.transitionTo('login');
				}
			} else if (statusCode === 404) {
				this.controllerFor('application').alert({
					message: "Couldn't find the resource for this page, please make sure the URL is valid.",
					type: 'error',
					persists: true
				});
				this.transitionTo('marketplaces');
			} else {
				this.controllerFor('application').alert({
					message: 'There was an error loading this page.',
					type: 'error',
					persists: true
				});
				this.transitionTo('marketplaces');
			}
		},

		willTransition: function() {
			this.controllerFor('search').send('closeSearch');
			this.controllerFor('application').alertTransition();
		},

		alert: function(options) {
			this.controllerFor('application').alert(options);
		},

		signOut: function() {
			this.transitionTo('logout');
		}
	}
});
