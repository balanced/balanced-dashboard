Balanced.SignUpRoute = Balanced.Route.extend({
	redirect: function() {
		if (Balanced.Auth.isRegistered()) {
			this.transitionTo('index');
		}
	},
	model: function() {
		var controller = Balanced.__container__.lookup("controller:registration");
		var auth = this.get('auth');

		if (auth.get('signedIn')) {
			return Balanced.currentMarketplace;
		} else {
			return auth.createNewGuestUser().then(function(apiKey) {
				var apiKeySecret = apiKey.get('secret');
				return controller
					.createMarketplaceForApiKeySecret(apiKeySecret)
					.then(function(marketplace) {
						marketplace.populateWithTestTransactions();
						auth.setupGuestUserMarketplace(marketplace);
						return marketplace;
					});
			});
		}
	},
	renderTemplate: function() {
		var self = this;
		this.render("start");
		Ember.run.next(function() {
			self.send("openModal", Balanced.UserCreateModalView);
		});
	},
});
