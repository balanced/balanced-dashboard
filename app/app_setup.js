// This is pulled out into a separate file so the Grunt neuter task doesn't
// add templating code to it while building

window.balancedSetupFunctions = [];

/*
Creates a new instance of an Ember application and
specifies what HTML element inside index.html Ember
should manage for you.
*/
window.setupBalanced = function(divSelector) {

	// default to #balanced-app if not specified
	divSelector = divSelector || '#balanced-app';
	ENV.HELPER_PARAM_LOOKUPS = true;

	// Uncomment to turn on logging for all object bindings
	// Ember.LOG_BINDINGS = true;

	// Uncomment to log DEPRECATIONS
	// ENV.RAISE_ON_DEPRECATION = true;
	// Ember.LOG_STACKTRACE_ON_DEPRECATION = true;

	window.Balanced = Ember.Application.create({
		rootElement: divSelector,

		// Basic logging, e.g. "Transitioned into 'post'"
		LOG_TRANSITIONS: true,

		// Extremely detailed logging, highlighting every internal
		// step made while transitioning into a route, including
		// `beforeModel`, `model`, and `afterModel` hooks, and
		// information about redirects and aborted transitions
		// LOG_TRANSITIONS_INTERNAL: true,

		// Uncomment to log view lookups
		// LOG_VIEW_LOOKUPS: true,

		// Uncomment to log auto-generated controllers & routes
		// LOG_ACTIVE_GENERATION: true,

		customEvents: {
			// key is the jquery event, value is the name used in views
			changeDate: 'changeDate'
		}
	});

	if (!window.TESTING) {
		// Defer the readiness until we know about login session
		window.Balanced.deferReadiness();
	}


	window.Balanced.onLoad = function() {
		//  initialize anything that needs to be done on application load
		Balanced.Analytics.init(Ember.ENV.BALANCED);

		// Configure modal parent selector
		$.fn.modal.defaults.manager = divSelector;
	};

	// Call the setup functions
	_.each(window.balancedSetupFunctions, function(setupFunction) {
		setupFunction();
	});

	if (!window.TESTING) {
		// Get the current login if logged in
		window.Balanced.Auth.getCurrentLogin().always(function() {
			// Advance the readiness
			window.Balanced.advanceReadiness();
		}).done(function() {
			// Trigger Sign In Transition Event manually
			// Delay it for 200ms to give time for any
			// transition to finish loading
			_.delay(function() {
				window.Balanced.Auth.trigger('signInTransition');
			}, 200);
		});

		window.Balanced.NET.loadCSRFTokenIfNotLoaded();
	}
};
