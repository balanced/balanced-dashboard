import Ember from "ember";

// We need a temporary route for logout so the views don't have to assume that
// the Balanced.Auth.user can be null for logged in pages
var LogoutRoute = Ember.Route.extend({
	pageTitle: 'Logout',

	redirect: function() {
		var self = this;
		if (self.controllerFor("sessions").get("isUserRegistered")) {
			this.get('auth').signOut().then(function() {
				self.transitionTo('login');
				self.controllerFor("notification_center").clearAlerts();
			});
		} else {
			self.transitionTo('login');
		}
	}
});

export default LogoutRoute;
