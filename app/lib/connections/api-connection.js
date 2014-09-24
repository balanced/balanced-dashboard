import BaseConnection from "./base-connection";
import ENV from "balanced-dashboard/config/environment";
import Utils from "balanced-dashboard/lib/utils";

var DEFAULT_SETTINGS = {
	dataType: 'json',
	contentType: 'application/json; charset=UTF-8',
	accepts: {
		json: 'application/vnd.balancedpayments+json; version=1.1'
	},
};

var API_COMMANDS_URIS = {
	marketplaces: "%@/marketplaces".fmt(ENV.BALANCED.API),
	api_keys: "%@/api_keys".fmt(ENV.BALANCED.API)
};

var ApiConnection = BaseConnection.extend({
	getEncodedAuthorization: function() {
		var apiKey = this.get("apiKey");
		return Utils.encodeAuthorization(apiKey);
	},

	isAuthorized: function() {
		return !Ember.isBlank(this.get("apiKey"));
	},

	createMarketplace: function(attributes) {
		return this.post(API_COMMANDS_URIS.marketplaces, attributes || {});
	},

	createApiKey: function(attributes) {
		return this.post(API_COMMANDS_URIS.api_keys, attributes || {});
	},

	settings: function(additionalSettings) {
		var headers = {};
		if (this.isAuthorized()) {
			headers["Authorization"] = this.getEncodedAuthorization();
		}
		var settings = _.extend({
			headers: headers
		}, DEFAULT_SETTINGS, additionalSettings);

		if (settings.data && settings.type.toUpperCase() !== "GET") {
			settings.data = JSON.stringify(settings.data);
		}
		return settings;
	},
});

export default ApiConnection;
