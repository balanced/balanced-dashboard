import Ember from "ember";
import Ajax from "balanced-dashboard/lib/ajax";
import ApiKey from "balanced-dashboard/models/api-key";
import Auth from "balanced-dashboard/auth";
import ApiConnection from "balanced-dashboard/lib/connections/api-connection";
import AuthConnection from "balanced-dashboard/lib/connections/auth-connection";
import ENV from "balanced-dashboard/config/environment";

var RegistrationController = Ember.Controller.extend({
	join: function(userFactory, authToken) {
		var self = this;
		return this
			.saveUser(userFactory)
			.then(function(userUri) {
				var email = userFactory.get("email_address");
				var password = userFactory.get("passwordConfirm");
				return Auth.signIn(email, password);
			})
			.then(function(user) {
				return self.addStarterMarketplace(user, authToken);
			});
	},

	addStarterMarketplace: function(user, authToken) {
		var self = this;
		var Marketplace = this.container.lookupFactory("model:marketplace");
		return self
			.getStarterMarketplaceApiKeySecret(user, authToken)
			.then(function(marketplaceApiKeySecret) {
				return self.addSecretToUser(user, marketplaceApiKeySecret);
			})
			.then(function(marketplaceUri) {
				return Marketplace.find(marketplaceUri);
			});
	},

	createApiKeySecret: function(attributes) {
		return this
			.getApiConnection()
			.createApiKey(attributes)
			.then(function(response) {
				var key = ApiKey.create();
				key.populateFromJsonResponse(response);
				return key.get("secret");
			});
	},

	createMarketplaceForApiKeySecret: function(apiKeySecret, attributes) {
		var Marketplace = this.container.lookupFactory("model:marketplace");
		return this
			.getApiConnection(apiKeySecret)
			.createMarketplace(attributes)
			.then(function(response) {
				var mp = Marketplace.create();
				mp.populateFromJsonResponse(response);
				return mp;
			});
	},

	createTestMarketplace: function() {
		var self = this;

		return this
			.createApiKeySecret()
			.then(function(apiKeySecret) {
				return self
					.createMarketplaceForApiKeySecret(apiKeySecret)
					.then(function(marketplace) {
						return Ember.RSVP.resolve(apiKeySecret, marketplace);
					});
			});
	},

	getStarterMarketplaceApiKeySecret: function(user, apiKeySecret) {
		if (Ember.isBlank(apiKeySecret)) {
			return this.createTestMarketplace();
		} else {
			return Ember.RSVP.resolve(apiKeySecret);
		}
	},

	addSecretToUser: function(user, apiKeySecret) {
		return user.addSecret(apiKeySecret);
	},

	saveUser: function(model) {
		model.validate();
		if (model.get("isValid")) {
			return model.save()
				.then(function(userUri) {
					return Ember.RSVP.resolve(userUri);
				}, function(errors) {
					return Ember.RSVP.reject(errors);
				});
		} else {
			return Ember.RSVP.reject();
		}
	},

	getApiConnection: function(secret) {
		var attributes = {};
		if (!Ember.isBlank(secret)) {
			attributes = {
				apiKey: secret
			};
		}
		return ApiConnection.create(attributes);
	},

	getAuthConnection: function() {
		var attributes = {
			csrfToken: Ajax.csrfToken
		};
		return AuthConnection.create(attributes);
	},

});

export default RegistrationController;
