Balanced.SessionsController = Ember.Controller.extend({
	needs: ["registration"],
	isRegistered: function() {
		return Balanced.Auth.isRegistered();
	},

	login: function(value) {
		if (Ember.typeOf(value) === "string") {
			Balanced.Auth.loginGuestUser(value);
			return Ember.RSVP.resolve();
		} else {
			return Balanced.Auth.signIn(value.email_address, value.password);
		}
	},

	destroy: function() {
		Balanced.Auth.forgetLogin();
	},

	createGuestUser: function() {
		var self = this;
		var auth = Balanced.Auth;
		var registrationController = this.get("controllers.registration");
		var user = auth.get("user");

		if (user) {
			return Ember.RSVP.resolve();
		} else {
			return auth
				.createNewGuestUser()
				.then(function(apiKey) {
					var secret = apiKey.get("secret");
					self.login(apiKey.get("secret"));
					return registrationController.createMarketplaceForApiKeySecret(secret)
				})
				.then(function(mp) {
					return;
				});
		}
	},
});
