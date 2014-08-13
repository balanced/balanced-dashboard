Balanced.StartRoute = Balanced.Route.extend({
	pageTitle: 'Getting started',

	model: function() {
		var controller = Balanced.__container__.lookup("controller:registration");
		var auth = this.get('auth');

		if (auth.get('signedIn')) {
			return Balanced.currentMarketplace;
		} else {
			return auth
				.createNewGuestUser()
				.then(function(apiKey) {
					var apiKeySecret = apiKey.get('secret');
					return controller.createMarketplaceForApiKeySecret(apiKeySecret)
				})
				.then(function(marketplace) {
					marketplace.populateWithTestTransactions();
					auth.setupGuestUserMarketplace(marketplace);
					return marketplace;
				});
		}
	},
	redirect: function() {
		if (Balanced.Auth.isRegistered()) {
			this.transitionTo('index');
		}
	},
	actions: {
		goToDashboard: function() {
			this.transitionTo('marketplace', this.currentModel);
		},
		goToDocumentation: function() {
			window.location = 'https://docs.balancedpayments.com';
		},
		goToSignUp: function() {
			this.transitionTo('sign_up');
		},
	}
});
