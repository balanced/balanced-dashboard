var validation = function(callback) {
	return {
		format: {
			validator: function(object, attribute, value) {
				var errors = object.get("validationErrors");
				callback(object, attribute, $.trim(value), errors);
			}
		}
	};
};

var isRequiredValidation = function(value, attribute, validationErrors) {
	if (value.length === 0) {
		validationErrors.add(attribute, "presence", null, "must be present");
	}
};

Balanced.MarketplaceFactory = Balanced.BaseFactory.extend({
	validations: {
		name: validation(function(object, attribute, value, validationErrors) {
			isRequiredValidation(value, attribute, validationErrors);
		}),
		support_email_address: validation(function(object, attribute, value, validationErrors) {
			isRequiredValidation(value, attribute, validationErrors);
		}),
		support_phone_number: validation(function(object, attribute, value, validationErrors) {
			isRequiredValidation(value, attribute, validationErrors);
		}),
		domain_url: validation(function(object, attribute, value, validationErrors) {
			isRequiredValidation(value, attribute, validationErrors);
		})
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
