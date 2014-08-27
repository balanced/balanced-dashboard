Balanced.LoginRoute = Balanced.Route.extend({
	modelObject: Balanced.Login,
	pageTitle: 'Login',

	beforeModel: function() {
		var sessionsController = this.controllerFor("sessions");
		if (sessionsController.get("isUserRegistered")) {
			this.transitionTo("marketplaces.index");
		}
	},

	setupController: function(controller, model) {
		controller.reset();
		this._super(controller, model);
	},
});
