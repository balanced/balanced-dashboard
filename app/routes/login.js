Balanced.LoginRoute = Balanced.Route.extend({
	pageTitle: 'Login',

	setupController: function(controller, model) {
		controller.reset();
		this._super(controller, model);
	},

	redirect: function() {
		// if you're logged in, no reason to let you see the login page
		if (Balanced.Auth.get('signedIn')) {
			this.transitionTo('marketplaces');
		}
	}
});
