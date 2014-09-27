import Ember from "ember";
import Auth from "../auth";

var SetupGuestUserRoute = Ember.Route.extend({
	beforeModel: function(transition) {
		var sessionsController = this.controllerFor("sessions");
		if (sessionsController.get("isUserRegistered")) {
			this.replaceWith("marketplaces.index");
		} else if (sessionsController.get("isUserMissing")) {
			return sessionsController.createGuestUser();
		}
	},

	model: function() {
		var user = Auth.get("user");
		return user.get("user_marketplaces").objectAt(0).get("marketplace");
	},

	afterModel: function(model, transition) {
		this.replaceWith("marketplace", model);
		transition.send("openModal", "register-flow/user-create-modal");
	},
});

export default SetupGuestUserRoute;
