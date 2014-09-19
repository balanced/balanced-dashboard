import Ember from "ember";
import Auth from "balanced-dashboard/auth";

var SessionsController = Ember.Controller.extend({
	needs: ["registration"],

	currentUser: Ember.computed.oneWay("auth.user"),
	isUserGuest: Ember.computed.oneWay("auth.isGuest"),

	isUserMissing: Ember.computed.none("currentUser"),
	isUserPresent: Ember.computed.not("isUserMissing"),

	isUserUnregistered: Ember.computed.not("isUserRegistered"),
	isUserRegistered: function() {
		return this.get("isUserPresent") && !this.get("isUserGuest");
	}.property("isUserPresent", "isUserGuest"),

	transitionPendingLogin: null,

	login: function(value) {
		if (Ember.typeOf(value) === "string") {
			Auth.loginGuestUser(value);
			return Ember.RSVP.resolve();
		} else {
			return Auth.signIn(value.email_address, value.password);
		}
	},

	nuke: function() {
		Auth.forgetLogin();
	},

	createGuestUser: function() {
		var self = this;
		var registrationController = this.get("controllers.registration");
		var user = Auth.get("user");

		if (user) {
			return Ember.RSVP.resolve();
		} else {
			return Auth
				.createNewGuestUser()
				.then(function(apiKey) {
					var secret = apiKey.get("secret");
					self.login(apiKey.get("secret"));
					return registrationController.createMarketplaceForApiKeySecret(secret);
				})
				.then(function(mp) {
					Auth.setupGuestUserMarketplace(mp);
				});
		}
	},

	setCurrentApiKey: function(apiKeySecret) {
		Auth.setAPIKey(apiKeySecret);
	},

	actions: {
		afterLoginTransition: function() {
			var pendingTransition = this.get("transitionPendingLogin");
			this.set("transitionPendingLogin", null);

			if (pendingTransition) {
				pendingTransition.retry();
			} else {
				this.transitionToRoute("marketplaces.index");
			}
		},
	},
});

export default SessionsController;
