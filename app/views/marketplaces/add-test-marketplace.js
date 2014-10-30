import Ember from "ember";
import Utils from "balanced-dashboard/lib/utils";

var AddTestMarketplaceView = Ember.View.extend({
	tagName: 'form',
	templateName: "marketplaces/add-test-marketplace",

	name: null,

	isSubmitting: false,

	actions: {
		add: function() {
			var self = this;
			var lookup = function(modelName) {
				return self.get("container").lookupFactory("model:" + modelName);
			};
			var ApiKey = lookup("api-key");
			var Marketplace = lookup("marketplace");
			var UserMarketplace = lookup("user-marketplace");

			if (this.get('isSubmitting')) {
				return;
			}
			this.set('isSubmitting', true);

			var marketplaceName = this.get('name');
			if (Ember.isBlank(marketplaceName)) {
				self.set('isSubmitting', false);
				return;
			}

			var auth = this.get('auth');
			Utils.setCurrentMarketplace(null);
			auth.unsetAPIKey();

			ApiKey.create().save()
				.then(function(apiKey) {
					var apiKeySecret = apiKey.get('secret');
					auth.setAPIKey(apiKeySecret);
					var settings = {
						headers: {
							Authorization: Utils.encodeAuthorization(apiKeySecret)
						}
					};

					return Marketplace.create({
						name: marketplaceName
					}).save(settings).then(function() {
						return apiKeySecret;
					});
				})
				.then(function(apiKeySecret) {
					var user = self.get('user');

					return UserMarketplace.create({
						uri: user.get('api_keys_uri'),
						secret: apiKeySecret
					}).save();
				})
				.then(function() {
					self.set('name', null);
					self.get("user").reload();
				})
				.finally(function() {
					self.set('isSubmitting', false);
				});
		}
	}
});

export default AddTestMarketplaceView;
