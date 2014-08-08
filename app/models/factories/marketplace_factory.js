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
		var apiKeySecret = this.get("apiKeySecret");
		return new Balanced.AuthenticatedConnection(ENV.BALANCED.API, apiKeySecret);
	},
	getPostUrl: function() {
		return "/marketplaces";
	},
	getPostAttributes: function() {
		return this.getProperties("name", "support_phone_number", "support_email_address", "domain_url");
	},
	handleResponse: function(response) {
		return response.marketplaces[0].href;
	},
});
