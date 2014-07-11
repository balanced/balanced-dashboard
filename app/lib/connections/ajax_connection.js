var BASE_AJAX_SETTINGS = {
	dataType: "JSON",
	contentType: 'application/json; charset=UTF-8',
	accepts: {
		json: "application/vnd.balancedpayments+json; version=1.1"
	}
};

var BASE_AJAX_METHODS = {
	get: function(path, query) {
		return this.ajax(this.uri(path, query), this.getAjaxSettings({
			type: "GET"
		}));
	},

	post: function(path, data) {
		return this.ajax(this.uri(path), this.getAjaxSettings({
			data: JSON.stringify(data),
			type: "POST"
		}));
	},

	del: function(path) {
		return this.ajax(this.uri(path), this.getAjaxSettings({
			type: "DELETE"
		}));
	},

	uri: function(path, query) {
		var resource = this.host + path;
		return Balanced.Utils.buildUri(resource, query);
	},

	getAjaxSettings: function(additionalSettings) {
		return _.extend({}, BASE_AJAX_SETTINGS, additionalSettings);
	},

	ajax: function(url, settings) {
		return new Ember.RSVP.Promise(function(resolve, reject) {
			window.$.ajax(url, settings)
				.then(function(m, state, xhr) {
					resolve(m);
				}, reject);
		});
	}
};


var defineConnection = function(klass, methods) {
	klass.prototype = _.extend({}, BASE_AJAX_METHODS, methods);
};

Balanced.AjaxConnection = function(host) {
	this.host = host;
};

defineConnection(Balanced.AjaxConnection, {});

Balanced.AuthenticatedConnection = function(host, secret) {
	this.host = host;
	this.secret = secret;
};

defineConnection(Balanced.AuthenticatedConnection, {
	getAjaxSettings: function(additionalSettings) {
		return _.extend({}, BASE_AJAX_SETTINGS, {
			headers: {
				Authorization: Balanced.Utils.encodeAuthorization(this.secret)
			}
		}, additionalSettings);
	},
});
