Balanced.SignUpRoute = Balanced.Route.extend({
	beforeModel: function() {
		if (this.controllerFor("sessions").get("isUserRegistered")) {
			this.transitionTo('index');
		}
	},

	model: function() {
		return this.controllerFor("sessions").createGuestUser();
	},

	renderTemplate: function() {
		var self = this;
		this.transitionTo("marketplace", this.controllerFor("guest_user").get('marketplace'));

		Ember.run.next(function() {
			self.send("openModal", Balanced.UserCreateModalView);
		});
	},
});
