import Ember from "ember";
import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger";

var INFINITE_LOOP_DURATION_MILLIS = 2500;
var INFINITE_LOOP_NUM_ERRORS = 5;

var ApplicationRoute = Ember.Route.extend(Ember.Evented, {
	init: function() {
		this.set('errorTimestamps', []);
	},

	actions: {
		closeModal: function() {
			return this
				.container
				.lookup("controller:modals_container")
				.close();
		},

		openModal: function(klass) {
			var container = this.get("container");
			var args = _.toArray(arguments).slice(1);
			return container
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

			AnalyticsLogger.trackEvent('route-error', {
				type: 'error-loading-route',
				location: window.location.toString(),
				statusCode: statusCode
			});

			if (statusCode === 401 || statusCode === 403) {
				if (error.get && error.get('uri')) {
					// if we loaded an ember object and got a 401/403, let's forget about the transition
					this.get('auth').set('attemptedTransition', null);

					this.controllerFor("notification_center")
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
				this.controllerFor("notification_center")
					.alertError("Couldn't find the resource for this page, please make sure the URL is valid.");
				this.transitionTo('marketplaces');
			} else {
				var controller = this.controllerFor("notification_center");
				var name = "PageLoadError";

				controller.clearNamedAlert(name);
				controller
					.alertError('There was an error loading this page.', {
						name: name
					});
				this.transitionTo('marketplaces');
			}
		},

		willTransition: function() {
			this.controllerFor('modals_container').close();
			this.controllerFor('notification_center').expireAlerts();
		},

		signOut: function() {
			this.controllerFor('notification_center').clearAlerts();
			this.transitionTo('logout');
		}
	}
});

export default ApplicationRoute;
