import Ember from "ember";

var AuthRoute = Ember.Route.extend({
	beforeModel: function(transition) {
		var sessionsController = this.controllerFor("sessions");
		if (!this.controllerFor("sessions").get("isUserPresent")) {
			this.controllerFor("sessions").set("transitionPendingLogin", transition);
			this.transitionTo('login');
		}
	}
});

export default AuthRoute;
