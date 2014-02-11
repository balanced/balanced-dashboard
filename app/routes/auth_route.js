Balanced.AuthRoute = Ember.Route.extend({
	beforeModel: function(transition) {
		var self = this;
		if (Balanced.Auth.get('signedIn')) {
			return;
		}

		Balanced.Auth.set('attemptedTransition', transition);
		this.transitionTo('login');
	}
});
