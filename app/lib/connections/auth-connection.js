import ENV from "balanced-dashboard/config/environment";
import BaseConnection from "./base-connection";

var AuthConnection = BaseConnection.extend({
	csrfToken: function() {
		var Ajax = require("balanced-dashboard/lib/ajax")["default"];
		return Ajax.csrfToken;
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

export default AuthConnection;
