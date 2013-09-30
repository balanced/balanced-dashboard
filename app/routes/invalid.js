Balanced.InvalidRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		Ember.Logger.warn("Invalid route specified: " + window.location.pathname + window.location.hash);
		Balanced.Analytics.trackEvent('route-error', {
			type: 'invalid-route',
			location: window.location.toString()
		});
		this.controllerFor('application').alert({
			message: "Invalid URL specified, please check the URL.",
			type: 'error'
		});
		this.transitionTo('marketplaces');
	},

	model: function(params) {
		return null;
	}
});
