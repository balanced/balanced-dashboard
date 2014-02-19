Balanced.AuthRoute = Balanced.Route.extend({
	beforeModel: function(transition) {
		var self = this;
		if (Balanced.Auth.get('signedIn')) {
			return;
		}

		Balanced.Auth.set('attemptedTransition', transition);

		var e = new Error('Not Authenicated!');
		transition.abort(e);

		this.transitionTo('login');
	}
});
