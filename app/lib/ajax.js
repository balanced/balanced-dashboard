require('app/lib/variables');

Balanced.NET = Ember.Namespace.create({
	csrfToken: $.cookie(Balanced.COOKIE.CSRF_TOKEN),
	defaultApiKey: null,

	loadCSRFToken: function() {
		var self = this;
		var deferred = Ember.RSVP.defer();
		// POSTing to / will return a csrf token
		this
			.ajax({
				type: 'POST',
				url: Ember.ENV.BALANCED.AUTH
			})
			.then(function(response) {
				self.csrfToken = response.csrf;
				deferred.resolve();
			});
		return deferred.promise;
	},

	loadCSRFTokenIfNotLoaded: function() {
		return this.csrfToken ?
			Ember.RSVP.resolve() :
			this.loadCSRFToken();
	},

	ajax: function(settings) {
		var connection;
		if (settings.url.indexOf(ENV.BALANCED.AUTH) >= 0) {
			connection = Balanced.Connections.AuthConnection.create({
				csrfToken: this.csrfToken
			});
		} else {
			connection = Balanced.Connections.ApiConnection.create({
				apiKey: this.defaultApiKey
			});
		}
		return connection.ajax(settings);
	}
});
