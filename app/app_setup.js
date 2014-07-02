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

		customEvents: {
			// key is the jquery event, value is the name used in views
			changeDate: 'changeDate'
		},

		ready: function() {
			$('#balanced-loading').remove();
		}
	});

	var Balanced = window.Balanced;

	Balanced.onLoad = function() {
		//  initialize anything that needs to be done on application load
		Balanced.Analytics.init(Ember.ENV.BALANCED);

		// Configure modal parent selector
		$.fn.modal.defaults.manager = divSelector;
	};

	// Call the setup functions
	_.each(window.balancedSetupFunctions, function(setupFunction) {
		setupFunction();
	});

	/* istanbul ignore if */
	if (!window.TESTING) {
		// Defer the readiness until we know about login session
		Balanced.deferReadiness();
		Balanced.NET.loadCSRFTokenIfNotLoaded()
			.then(function() {
				// Get the current login if logged in
				return Balanced.Auth.getCurrentLogin();
			})
			.
		finally(function() {
			Balanced.advanceReadiness();
		});

	}
};
