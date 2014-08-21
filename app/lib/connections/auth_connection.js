Balanced.Connections.AuthConnection = Balanced.Connections.BaseConnection.extend({
	csrfToken: function() {
		return Balanced.NET.csrfToken;
	}.property(),

	getCsrfToken: function() {
		return this.get("csrfToken");
	},

	createUser: function(attributes) {
		return this.post("%@/users".fmt(ENV.BALANCED.AUTH), attributes);
	},

	settings: function(additionalSettings) {
		var settings = _.extend({
			headers: {
				"X-CSRFToken": this.getCsrfToken()
			}
		}, additionalSettings);

		// This does NOT work in Firefox
		// See http://stackoverflow.com/questions/16668386/cors-synchronous-requests-not-working-in-firefox
		/* istanbul ignore if */
		if (!window.TESTING) {
			settings.xhrFields = {
				withCredentials: true
			};
		} else {
			settings.beforeSend = function(xhr) {
				xhr.withCredentials = true;
			};
		}
		return settings;
	}
});
