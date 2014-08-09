var INFINITE_LOOP_DURATION_MILLIS = 2500;
var INFINITE_LOOP_NUM_ERRORS = 5;

Balanced.ApplicationRoute = Balanced.Route.extend(Ember.Evented, {
	init: function() {
		this.set('errorTimestamps', []);
	},

	actions: {
		openModal: function(klass) {
			var args = _.toArray(arguments).slice(1);
			return this
				.container
				.lookup("controller:modals_container")
				.open(klass, args);
		},

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
						this.get('auth').forgetLogin();
						this.transitionTo('login');

						return;
					}
				}
			}

			// the error object could be an ember object or a jqxhr
			var statusCode = error.errorStatusCode || error.status;
			var uri = error.uri;

			Ember.Logger.error("Error while loading route (%@: %@): ".fmt(statusCode, uri), error.stack || error.message || error.name || error);

			// if we had a problem loading the marketplace, check that it's not the current
			// marketplace, since that might send us into an infinite loop
			if (error.get && error.get('uri') === this.get('auth').getLastUsedMarketplaceUri()) {
				this.get('auth').forgetLastUsedMarketplaceUri();
			}

			Balanced.Analytics.trackEvent('route-error', {
				type: 'error-loading-route',
				location: window.location.toString(),
				statusCode: statusCode
			});

			if (statusCode === 401 || statusCode === 403) {
				if (error.get && error.get('uri')) {
					// if we loaded an ember object and got a 401/403, let's forget about the transition
					this.get('auth').set('attemptedTransition', null);

					this.controllerFor("temporary_alerts")
						.alertError('You are not permitted to access this resource.');
					this.transitionTo('marketplaces');
				} else if (transition) {
					this.get('auth').set('attemptedTransition', transition);

					// If we're not authorized, need to log in (maybe as a different user),
					// so let's log out
					this.get('auth').forgetLogin();
					this.transitionTo('login');
				}
			} else if (statusCode === 404) {
				this.controllerFor("temporary_alerts")
					.alertError("Couldn't find the resource for this page, please make sure the URL is valid.");
				this.transitionTo('marketplaces');
			} else {
				this.controllerFor("temporary_alerts")
					.alertError('There was an error loading this page.');
				this.transitionTo('marketplaces');
			}
		},

		willTransition: function() {
			this.controllerFor('marketplace.search').send('closeSearch');
			this.controllerFor('temporary_alerts').expireAlerts();
		},

		signOut: function() {
			this.transitionTo('logout');
		}
	}
});
