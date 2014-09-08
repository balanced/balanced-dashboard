Balanced.GuestUserController = Balanced.Controller.extend({
	needs: ["registration"],
	secretApiKey: function() {
		return Ember.get("Balanced.NET.defaultApiKey");
	}.property("Balanced.NET.defaultApiKey"),

	createUser: function() {
		var self = this;
		return this.get("controllers.registration").createTestMarketplace(function(apiKeySecret, marketplace) {
			Balanced.Auth.rememberGuestUser(apiKey);
		});
	},

	user: function() {
		return Ember.get("Balanced.Auth.user");
	}.property("Balanced.Auth.user"),
});
