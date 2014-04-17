document.write('<script src="https:\/\/js.balancedpayments.com\/1.1\/balanced.js"><\/script>');

QUnit.config.testTimeout = 30000;

QUnit.testStart(function(test) {
	var module = test.module ? test.module : '';

	// Display an error if asynchronous operations are queued outside of
	// Ember.run.  You need this if you want to stay sane.
	Ember.testing = true;

	// stub for unit tests
	Ember.ENV.BALANCED.WWW = 'http://example.org';

	Ember.$('<style>#ember-testing-container { position: absolute; background: white; bottom: 0; right: 0; width: 640px; height: 600px; overflow: auto; z-index: 9999; border: 1px solid #ccc; } #ember-testing { zoom: 50%; }</style>').appendTo('head');
	Ember.$('<div id="ember-testing-container"><div id="ember-testing"></div></div>').appendTo('body');

	Ember.run(function() {
		window.setupBalanced('#ember-testing');

		Balanced.THROTTLE = 0;
		Balanced.setupForTesting();
	});

	Ember.run(function() {
		window.Balanced.advanceReadiness();
	});

	Balanced.injectTestHelpers();

	window.Balanced.onLoad();
	// turn off ajax async
	$.ajaxSetup({
		async: false
	});
});

QUnit.testDone(function(test) {
	var module = test.module ? test.module : '';

	Balanced.removeTestHelpers();
	Ember.run(Balanced, Balanced.destroy);
	Balanced = null;
	Ember.$('#ember-testing-container, #ember-testing').remove();

	Ember.testing = false;
});
