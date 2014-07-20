Balanced.Connections.ApiConnection = Balanced.Connections.BaseConnection.extend({
	getEncodedAuthorization: function() {
		var apiKey = this.get("apiKey");
		return Balanced.Utils.encodeAuthorization(apiKey);
	},

	settings: function(additionalSettings) {
		var settings = _.extend({
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			type: "GET",
			accepts: {
				json: 'application/vnd.balancedpayments+json; version=1.1'
			},
			headers: {
				Authorization: this.getEncodedAuthorization()
			}
		}, additionalSettings);

		if (settings.data && settings.type.toUpperCase() !== "GET") {
			settings.data = JSON.stringify(settings.data);
		}
		return settings;
	},
});
