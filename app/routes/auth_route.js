Balanced.AuthRoute = Balanced.Route.extend({
	beforeModel: function(transition) {
		var self = this;
		if (this.get('auth.signedIn')) {
			return;
		}

		this.set('auth.attemptedTransition', transition);

		var e = new Error('Not Authenicated!');
		transition.abort(e);

		this.transitionTo('login');
	}
});
