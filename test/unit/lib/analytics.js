module('Balanced.Analytics', {
	setup: function() {
		var mixPanelAPI = {
			track: sinon.spy()
		};
		var GACAPI = {
			push: sinon.spy()
		};

		window.mixpanel = mixPanelAPI;
		window._gaq = GACAPI;
		Balanced.Analytics.isMixpanelLoaded = true;
		Balanced.Analytics.isGoogleAnalyticsLoaded = true;
	},
	teardown: function() {
		Testing.restoreMethods(
			window.mixpanel,
			window._gaq
		);
		Balanced.Analytics.isMixpanelLoaded = false;
		Balanced.Analytics.isGoogleAnalyticsLoaded = false;
	}
});

test('test click tracking', function(assert) {
	var buttonText = 'sally sad sack';
	var ctx = $('<button>' + buttonText + '</button>');

	Balanced.Analytics.trackClick.call(ctx);

	var expectedEventName = 'click ' + buttonText;

	assert.ok(window.mixpanel.track.calledWith(expectedEventName, {}));
	assert.ok(window._gaq.push.calledWith(
		['_trackEvent', 'dashboard', expectedEventName]
	));
});
