Balanced.SignUpRoute = Balanced.Route.extend({
	beforeModel: function(transition) {
		if (this.controllerFor("sessions").get("isUserRegistered")) {
			this.transitionTo('index');
		} else if (transition.sequence > 0) {
			transition.abort();
			transition.send("openModal", Balanced.UserCreateModalView);
		} else {
			this.transitionTo("setup_guest_user");
		}
	},
});
