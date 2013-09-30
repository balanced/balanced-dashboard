Balanced.StartRoute = Balanced.Route.extend({
	pageTitle: 'Getting started',

	model: function() {
		if (Balanced.Auth.get('signedIn')) {
			return Balanced.currentMarketplace;
		} else {
			return Balanced.Auth.createNewGuestUser().then(function(apiKey) {
				var apiKeySecret = apiKey.get('secret');
				var settings = {
					headers: {
						Authorization: Balanced.Utils.encodeAuthorization(apiKeySecret)
					}
				};
				return Balanced.Marketplace.create().save(settings).then(function(marketplace) {
					//  pre-populate marketplace with transactions
					var uri = marketplace.get('uri');
					var id = uri.substr(uri.lastIndexOf('/') + 1);
					Balanced.NET.ajax({
						url: ENV.BALANCED.AUTH + '/marketplaces/%@/spam'.fmt(id),
						type: 'PUT'
					});

					Balanced.Auth.setupGuestUserMarketplace(marketplace);

					return marketplace;
				});
			});
		}
	},
	redirect: function() {
		if (Balanced.Auth.get('user') && !Balanced.Auth.get('isGuest')) {
			this.transitionTo('index');
		}
	},
	actions: {
		goToDashboard: function() {
			this.transitionTo('activity', this.currentModel);
		},
		goToDocumentation: function() {
			window.location = 'https://docs.balancedpayments.com';
		},
		goToApply: function() {
			this.transitionTo('marketplaces.apply');
		},
		goToLogin: function() {
			// Since we already logged them in as guest, log them out so they can sign in as themselves
			Balanced.Auth.forgetLogin();
			this.transitionTo('login');
		}
	}
});
