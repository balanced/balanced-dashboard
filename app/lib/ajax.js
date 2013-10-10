require('app/lib/variables');

Balanced.NET = (function() {
	return {
		loadCSRFToken: function() {
			// POSTing to / will return a csrf token
			return this.ajax({
				type: 'POST',
				url: Ember.ENV.BALANCED.AUTH
			}).success(function(response, status, jqxhr) {
				Balanced.NET.csrfToken = response.csrf;
			});
		},
		csrfToken: $.cookie(Balanced.COOKIE.CSRF_TOKEN),
		defaultApiKey: null,

		ajax: function(settings) {
			if (null == settings) {
				settings = {};
			}

			var def = {
				dataType: 'json',
				contentType: 'application/json; charset=UTF-8',
				accepts: {
					json: 'application/vnd.balancedpayments+json; version=1.1'
				},
				headers: {}
			};

			if (this.defaultApiKey) {
				def.headers['Authorization'] = Balanced.Utils.encodeAuthorization(this.defaultApiKey);
			}

			if (settings.url.indexOf(ENV.BALANCED.AUTH) !== -1) {
				if (this.csrfToken) {
					def.headers['X-CSRFToken'] = this.csrfToken;
				}

				def.xhrFields = {
					withCredentials: true
				};
			}

			if (settings.data && Ember.isNone(settings.contentType)) {
				if (settings.type && settings.type.toUpperCase !== 'GET') {
					settings.data = JSON.stringify(settings.data);
				}
			}

			settings = $.extend(def, settings);
			return $.ajax(settings);
		}
	};

})();
