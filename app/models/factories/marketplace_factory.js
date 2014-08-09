var PRESENCE_VALIDATION = {
	presence: true
};

Balanced.MarketplaceFactory = Balanced.BaseFactory.extend({
	validations: {
		name: PRESENCE_VALIDATION,
		support_email_address: PRESENCE_VALIDATION,
		support_phone_number: PRESENCE_VALIDATION,
		domain_url: PRESENCE_VALIDATION
	},

	getConnection: function() {
		return Balanced.Connections.ApiConnection.create({
			apiKey: this.get("apiKeySecret")
		});
	},
	getPostUrl: function() {
		return "%@/marketplaces".fmt(ENV.BALANCED.API);
	},
	getPostAttributes: function() {
		return this.getProperties("name", "support_phone_number", "support_email_address", "domain_url");
	},
	handleResponse: function(response) {
		return response.marketplaces[0].href;
	},
});
