import Ember from "ember";
import ApiKey from "balanced-dashboard/models/api-key";
import Marketplace from "balanced-dashboard/models/marketplace";
import UserMarketplace from "balanced-dashboard/models/user-marketplace";
import Utils from "balanced-dashboard/lib/utils";

var AddTestMarketplaceView = Ember.View.extend({
	tagName: 'form',
	templateName: "marketplaces/add-test-marketplace",

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
			var auth = this.get('auth');

			if (!marketplaceName) {
				self.set('isSubmitting', false);
				return;
			}

			Utils.setCurrentMarketplace(null);
			auth.unsetAPIKey();

			ApiKey.create().save().then(function(apiKey) {
				var apiKeySecret = apiKey.get('secret');
				//  set the api key for this request
				auth.setAPIKey(apiKeySecret);
				var settings = {
					headers: {
						Authorization: Utils.encodeAuthorization(apiKeySecret)
					}
				};

				Marketplace.create({
					name: marketplaceName
				}).save(settings).then(function(marketplace) {
					var user = self.get('user');

					UserMarketplace.create({
						uri: user.get('api_keys_uri'),
						secret: apiKeySecret
					}).save().then(function() {
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

export default AddTestMarketplaceView;
