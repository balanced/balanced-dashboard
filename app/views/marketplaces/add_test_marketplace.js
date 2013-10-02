Balanced.AddTestMarketplaceView = Balanced.View.extend({
	templateName: 'marketplaces/_add_test',
	tagName: 'form',

	name: null,

	isSubmitting: false,

	actions: {
		add: function() {
			if (this.get('isSubmitting')) {
				return;
			}
			this.set('isSubmitting', true);

			var self = this;
			var marketplaceName = this.get('name');
			if (!marketplaceName) {
				self.set('isSubmitting', false);
				return;
			}

			Balanced.Utils.setCurrentMarketplace(null);
			Balanced.Auth.unsetAPIKey();

			Balanced.APIKey.create().save().then(function(apiKey) {
				var apiKeySecret = apiKey.get('secret');
				//  set the api key for this request
				Balanced.Auth.setAPIKey(apiKeySecret);
				var settings = {
					headers: {
						Authorization: Balanced.Utils.encodeAuthorization(apiKeySecret)
					}
				};

				Balanced.Marketplace.create({
					name: marketplaceName
				}).save(settings).then(function(marketplace) {
					var user = Balanced.Auth.get('user');

					Balanced.UserMarketplace.create({
						uri: user.api_keys_uri,
						secret: apiKeySecret
					}).save().then(function() {
						marketplace.populateWithTestTransactions();

						self.set('isSubmitting', false);
						self.set('name', null);
						user.reload();
					});
				}, function() {
					self.set('isSubmitting', false);
				});
			}, function() {
				self.set('isSubmitting', false);
			});
		}
	}
});
