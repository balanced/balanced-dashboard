Balanced.SetupGuestUserRoute = Balanced.Route.extend({
	beforeModel: function(transition) {
		var sessionsController = this.controllerFor("sessions");

		if (sessionsController.get("isUserRegistered")) {
			this.transitionTo("marketplaces.index");
		} else if (sessionsController.get("isUserGuest")) {
			var model = this.controllerFor("guest_user").get("marketplace");
			this.transitionTo("marketplace", model);
			transition.send("openModal", Balanced.UserCreateModalView);
		} else if (sessionsController.get("isUserMissing")) {
			return this.controllerFor("guest_user").createUser();
		}
	},

	model: function() {
		var guestUserController = this.controllerFor("guest_user");
		var apiKey = guestUserController.get("secretApiKey");
		return this.controllerFor("registration").createMarketplaceForApiKeySecret(apiKey);
	},

	redirect: function(model, transition) {
		this.transitionTo("marketplace", model);
		transition.send("openModal", Balanced.UserCreateModalView);
	},
});
