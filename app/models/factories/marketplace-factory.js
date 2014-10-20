import BaseFactory from "./base";
import ApiConnection from "balanced-dashboard/lib/connections/api-connection";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";

var PRESENCE_VALIDATION = {
	presence: true
};

var MarketplaceFactory = BaseFactory.extend({
	validations: {
		isTermsAccepted: {
			checked: {
				validator: function(object, attribute, value) {
					if (value !== true) {
						object.get('validationErrors').add(attribute, 'checked', null, 'must be checked');
					}
				}
			}
		},
		name: PRESENCE_VALIDATION,
		support_email_address: PRESENCE_VALIDATION,
		support_phone_number: {
			presence: true,
			length: {
				maximum: 15,
			},
			format: {
				validator: ValidationHelpers.phoneNumberValidator
			}
		},
		domain_url: PRESENCE_VALIDATION
	},

	isTermsAccepted: false,

	connection: function() {
		return ApiConnection.create({
			apiKey: this.get("apiKeySecret")
		});
	}.property("apiKeySecret"),

	getConnection: function() {
		return this.get("connection");
	},
	_save: function() {
		return this.getConnection().createMarketplace(this.getPostAttributes());
	},
	getPostAttributes: function() {
		return this.getProperties("name", "support_phone_number", "support_email_address", "domain_url");
	},
	getPropertiesDump: function() {
		return this.getPostAttributes();
	},
	handleResponse: function(response) {
		return response.marketplaces[0].href;
	},
});

export default MarketplaceFactory;
