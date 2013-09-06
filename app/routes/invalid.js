Balanced.InvalidRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		Ember.Logger.warn("Invalid route specified: " + window.location.pathname + window.location.hash);
		Balanced.Analytics.trackEvent('route-error', {
			type: 'invalid-route',
			location: window.location.toString()
		});
		this.transitionTo('index');
	},

	model: function (params) {
		return null;
	}
});
