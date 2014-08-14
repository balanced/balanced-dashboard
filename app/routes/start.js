Balanced.StartRoute = Balanced.Route.extend({
	pageTitle: 'Getting started',

	beforeModel: function() {
		if (this.controllerFor("sessions").get("isUserRegistered")) {
			this.transitionTo('index');
		}
	},

	model: function() {
		return this.controllerFor("sessions").createGuestUser();
	},
});
