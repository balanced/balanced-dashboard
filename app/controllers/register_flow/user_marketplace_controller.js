Balanced.UserMarketplaceController = Balanced.Controller.extend({
	needs: ["registration", "sessions"],

	pushMarketplace: function(user, secret, marketplaceHref) {
		var self = this
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
		return Balanced.Marketplace.find(marketplaceHref);
	},
});
