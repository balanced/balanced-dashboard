Balanced.InvalidRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		Ember.Logger.warn("Invalid route specified: " + window.location.pathname + window.location.hash);
		this.transitionTo('index');
	},

	model: function (params) {
		return null;
	}
});
