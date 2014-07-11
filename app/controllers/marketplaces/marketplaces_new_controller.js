var ExecutionErrorHandler = {
	messagesFromResponse: function(response, defaultMessage) {
		if (response.message) {
			return [response.message];
		} else if (response.description) {
			return [response.description];
		} else if (response.errors) {
			return response.errors.mapBy("description");
		} else if (defaultMessage) {
			return [defaultMessage];
		} else {
			return ["There was an error executing this step"];
		}
	}
};

var LoaderState = Ember.Object.extend({
	isLoading: false,
	isError: false,
	message: "",
	errorMessages: function() {
		return [];
	}.property(),
	execute: function(callback) {
		var self = this;
		this.setProperties({
			isLoading: true,
			isError: false,
			errorMessages: [],
		});
		return new Ember.RSVP.Promise(function(resolve, reject) {
			Ember.RSVP.resolve(callback()).then(function(a) {
				self.setProperties({
					isLoading: false
				});
				resolve(a);
			}, function(response) {
				self.setProperties({
					errorMessages: ExecutionErrorHandler.messagesFromResponse(response),
					isLoading: false,
					isError: true
				});
				reject();
			});
		});
	},
});


Balanced.MarketplacesNewController = Balanced.Controller.extend({
	apiKeysUri: Ember.computed.oneWay("user.api_keys_uri"),
	setupLoaderState: function(attributes) {
		var loaderState = LoaderState.create(attributes);
		this.set("loaderState", loaderState);
		return loaderState;
	},

	linkApiKey: function(marketplaceHref, apiKeySecret) {
		var marketplaceId = marketplaceHref.split("/")[2];
		var self = this;
		var loader = this.setupLoaderState({
			message: "Linking Api Key to User",
			callback: function() {
				self.linkApiKey(marketplaceHref, apiKeySecret);
			}
		});
		loader
			.execute(function() {
				return Balanced.UserMarketplace
					.create({
						secret: apiKeySecret,
						uri: self.get("apiKeysUri")
					})
					.save()
					.then(function() {
						Balanced.Auth.setAPIKey(apiKeySecret);
						self.transitionToRoute("marketplace.bank_account_new", marketplaceId);
					});
			});
	},

	isCreateApiKeyForm: Ember.computed.equal("marketplaceFactory", undefined),
	isCreateMarketplaceForm: Ember.computed.not("isCreateApiKeyForm"),

	actions: {
		retry: function(callback) {
			callback();
		},

		apiKeyCreated: function(apiKeySecret) {
			this.setProperties({
				marketplaceFactory: Balanced.MarketplaceFactory.create({
					apiKeySecret: apiKeySecret
				})
			});
		},

		marketplaceCreated: function(marketplaceHref, apiKeySecret) {
			this.linkApiKey(marketplaceHref, apiKeySecret);
		},
	}
});
