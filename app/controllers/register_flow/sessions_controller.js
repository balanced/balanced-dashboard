var oneWayGlobal = function(globalName) {
	return Ember.computed(globalName, function() {
		return Ember.get(globalName);
	});
};

Balanced.SessionsController = Ember.Controller.extend({
	needs: ["registration"],

	currentUser: oneWayGlobal("Balanced.Auth.user"),
	isUserGuest: oneWayGlobal("Balanced.Auth.isGuest"),

	isUserMissing: Ember.computed.none("currentUser"),
	isUserPresent: Ember.computed.not("isUserMissing"),

	isUserUnregistered: Ember.computed.not("isUserRegistered"),
	isUserRegistered: function() {
		return this.get("isUserPresent") && !this.get("isUserGuest");
	}.property("isUserPresent", "isUserGuest"),

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
					return registrationController.createMarketplaceForApiKeySecret(secret);
				})
				.then(function(mp) {
					return;
				});
		}
	},
});
