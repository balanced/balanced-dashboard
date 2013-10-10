Balanced.AjaxAdapter = Balanced.BaseAdapter.extend({
	initAdapter: function() {
		this.hostsByType = {};
	},

	_uri: function(type, uri) {
		this._checkParams(type, uri);

		var host = this.getHostForType(type);
		if (uri && uri.indexOf(host) !== 0 && uri.indexOf('https') !== 0) {
			uri = host + uri;
		}
		return uri;
	},

	get: function(type, uri, success, error) {
		var settings = {};
		settings.error = error;
		this.ajax(this._uri(type, uri), 'GET', settings).then(function(json) {
			success(json);
		});
	},

	create: function(type, uri, data, success, error, settings) {
		console.log(arguments);
		settings = settings || {};
		settings.data = data;
		settings.error = error;
		this.ajax(this._uri(type, uri), 'POST', settings).then(function(json) {
			success(json);
		});
	},

	update: function(type, uri, data, success, error, settings) {
		settings = settings || {};
		settings.data = data;
		settings.error = error;
		this.ajax(this._uri(type, uri), 'PUT', settings).then(function(json) {
			success(json);
		});
	},

	delete: function(type, uri, success, error, settings) {
		settings = settings || {};
		settings.error = error;
		this.ajax(this._uri(type, uri), 'DELETE', settings).then(function(json) {
			success(json);
		});
	},

	ajax: function(url, type, settings) {
		settings = settings || {};
		settings.url = url;
		settings.type = type;
		settings.context = this;

		var alreadyHasAuth = settings.headers && settings.headers['Authorization'];

		// HACK this goes away when we have oAuth
		if (!alreadyHasAuth && url && url.indexOf(ENV.BALANCED.AUTH) === -1) {
			if (Balanced.Auth.get('signedIn')) {
				var marketplaceId = Balanced.currentMarketplace ? Balanced.currentMarketplace.get('id') : null;

				var matches = /\/marketplaces\/([^\/]+)/.exec(url);
				if (matches) {
					marketplaceId = matches[1];
				}

				var userMarketplace = Balanced.Auth.get('user').user_marketplace_for_id(marketplaceId);

				if (!userMarketplace || !userMarketplace.get('secret')) {
					if (marketplaceId) {
						Ember.Logger.warn("Couldn't find user marketplace for ID %@ (url: %@)".fmt(marketplaceId, url));

						// If we couldn't find the user marketplace, maybe this is an admin user, so hit the auth server to try to find the API secret
						return Balanced.NET.ajax({
							url: ENV.BALANCED.AUTH + '/marketplaces/%@'.fmt(marketplaceId),
							type: 'GET',
							error: settings.error
						}).then(function(response) {
							Balanced.Auth.addUserMarketplace(response.id, response.uri, response.name, response.secret);

							settings.headers = settings.headers || {};
							settings.headers['Authorization'] = Balanced.Utils.encodeAuthorization(response.secret);
							return Balanced.NET.ajax(settings);
						});
					}
				} else {
					var secret = userMarketplace.get('secret');
					settings.headers = settings.headers || {};
					settings.headers['Authorization'] = Balanced.Utils.encodeAuthorization(secret);
				}
			}
		}

		return Balanced.NET.ajax(settings);
	},

	registerHostForType: function(type, host) {
		this.hostsByType[type] = host;
	},

	getHostForType: function(type) {
		var host = ENV.BALANCED.API;
		if (this.hostsByType[type]) {
			host = this.hostsByType[type];
		}
		return host;
	}
});
