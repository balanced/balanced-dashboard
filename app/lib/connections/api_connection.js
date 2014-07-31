Balanced.Connections.ApiConnection = Balanced.Connections.BaseConnection.extend({
	getEncodedAuthorization: function() {
		var apiKey = this.get("apiKey");
		return Balanced.Utils.encodeAuthorization(apiKey);
	},

	isAuthorized: function() {
		return !Ember.isBlank(this.get("apiKey"));
	},

	settings: function(additionalSettings) {
		var headers = {};
		if (this.isAuthorized()) {
			headers["Authorization"] = this.getEncodedAuthorization();
		}
		var settings = _.extend({
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			type: "GET",
			accepts: {
				json: 'application/vnd.balancedpayments+json; version=1.1'
			},
			headers: headers
		}, additionalSettings);

		if (settings.data && settings.type.toUpperCase() !== "GET") {
			settings.data = JSON.stringify(settings.data);
		}
		return settings;
	},
});
