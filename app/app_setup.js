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
	window.Balanced = Ember.Application.create({
		rootElement: divSelector,
		LOG_TRANSITIONS: true,

		customEvents: {
			// key is the jquery event, value is the name used in views
			changeDate: 'changeDate'
		}
	});

	// Defer the readiness until we know about login session
	window.Balanced.deferReadiness();


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

	// Get the current login if logged in
	window.Balanced.Auth.getCurrentLogin().always(function() {
		// Advance the readiness
		window.Balanced.advanceReadiness();
	});
	window.Balanced.NET.loadCSRFToken();
};
