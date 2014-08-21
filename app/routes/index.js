Balanced.IndexRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		var sessions = this.controllerFor("sessions");

		if (sessions.get("isUserRegistered")) {
			this.transitionTo('marketplaces');
		} else {
			this.transitionTo("login");
		}
	}
});
