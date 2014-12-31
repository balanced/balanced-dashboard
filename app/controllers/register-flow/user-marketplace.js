import Ember from "ember";

var UserMarketplaceController = Ember.Controller.extend({
	needs: ["registration", "sessions", "notification_center"],

	pushMarketplace: function(user, secret, marketplaceHref) {
		var self = this;
		return this
			.createUserMarketplace(user, secret)
			.then(function() {
				return self.setApiKeySecret(secret);
			})
			.then(function() {
				return self.reloadUser(user);
			})
			.then(function() {
				return self.findMarketplace(marketplaceHref);
			});
	},

	createUserMarketplace: function(user, secret) {
		return this.get("controllers.registration").addSecretToUser(user, secret);
	},

	setApiKeySecret: function(secret) {
		return this.get("controllers.sessions").setCurrentApiKey(secret);
	},

	reloadUser: function(user) {
		return user.reload();
	},

	findMarketplace: function(marketplaceHref) {
		return this.get("container").lookupFactory("model:marketplace").find(marketplaceHref);
	},

	addApiKeyToCurrentUserFlow: function(apiKeySecret) {
		var self = this;
		var notification = this.get("controllers.notification_center");
		notification.alertInfo("Linking the marketplace to your user", {
			name: "mp-linking"
		});
		return this.addApiKeyToCurrentUser(apiKeySecret)
			.then(function(href) {
				notification.clearNamedAlert("mp-linking");
				return self.get("container")
					.lookupFactory("model:marketplace")
					.find(href);
			})
			.then(function(marketplace) {
				self.transitionToRoute("marketplace", marketplace);
			});
	},

	addApiKeyToCurrentUser: function(apiKeySecret) {
		var user = this.container.lookup("auth:main").get("user");
		return user.addSecret(apiKeySecret);
	}
});

export default UserMarketplaceController;
