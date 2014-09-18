import ENV from "balanced-dashboard/config/environment";

var auth = Balanced.Auth = Ember.Namespace.extend(Ember.Evented).create({
	loadCsrfTokenIfNotLoaded: function() {
		return Balanced.NET.loadCSRFTokenIfNotLoaded();
	},
	request: function(opts) {
		var deferred = Ember.RSVP.defer();
		Balanced.NET.ajax(opts || {})
			.done(function(response) {
				deferred.resolve(response);
			})
			.fail(function(response) {
				deferred.reject(response);
			});
		return deferred.promise;
	},
	signInRequest: function(options) {
		var self = this;
		var attributes = _.extend({}, {
			url: ENV.BALANCED.AUTH + '/logins',
			type: 'POST'
		}, options);
		return this.request(attributes)
			.then(function(response) {
				var user = Balanced.User.create();
				user.populateFromJsonResponse(response.user);
				self.setAuthProperties(
					true,
					user,
					response.user_id,
					response.user_id,
					false,
					response.user.admin
				);
				self.rememberLogin(response.uri);
				return user;
			})
			.then(function(user) {
				return self.loadExtensions(user)
					.then(function() {
						return user;
					});
			})
			.then(function(user) {
				if (user.get("admin")) {
					Balanced.Shapeshifter.load("balanced-admin", true);
					self.setAPIKey(user.get("admin"));
				}
				return user;
			})
			.then(undefined, function(jqxhr) {
				if (jqxhr.responseJSON && jqxhr.responseJSON.uri) {
					self.rememberLogin(jqxhr.responseJSON.uri);
				}
				return Ember.RSVP.reject(jqxhr);
			});
	},

	signIn: function(emailAddress, password) {
		return this.signInRequest({
			data: {
				email_address: emailAddress,
				password: password
			}
		});
	},

	getCurrentLogin: function() {
		var self = this;
		return this
			.signInRequest({
				url: ENV.BALANCED.AUTH + '/logins/current',
				type: 'GET'
			})
			.then(undefined, function() {
				var authCookie = $.cookie(Balanced.COOKIE.EMBER_AUTH_TOKEN);
				if (authCookie) {
					return self.signInRequest({
						data: {
							uri: authCookie
						}
					});
				} else {
					var existingApiKey = self.getGuestAPIKey();

					if (existingApiKey) {
						return self.rememberGuestUser(existingApiKey);
					}
				}
			});
	},

	rememberGuestUser: function(apiKey) {
		var self = this;
		this.setAPIKey(apiKey);

		return Balanced.APIKey.findAll()
			.then(function(apiKeys) {
				var apiKeysWithSecrets = apiKeys.filterBy('secret');
				var secret = apiKeysWithSecrets.length ? apiKeysWithSecrets[0].get('secret') : null;
				self.loginGuestUser(secret);
				return Balanced.Marketplace.findAll();
			})
			.then(function(marketplaces) {
				var marketplace = marketplaces.get('length') ? marketplaces.objectAt(0) : null;
				self.setupGuestUserMarketplace(marketplace);
				return marketplace;
			});
	},

	loginGuestUser: function(apiKey) {
		this.storeGuestAPIKey(apiKey);
		this.setAPIKey(apiKey);

		var guestUser = Balanced.User.create({
			user_marketplaces: Ember.A(),
			marketplaces_uri: '/users/guest/marketplaces',
			api_keys_uri: '/users/guest/api_keys'
		});
		this.setAuthProperties(true, guestUser, '/users/guest', apiKey, true, false);
	},

	setupGuestUserMarketplace: function(marketplace) {
		this.addUserMarketplace(
			marketplace.get('id'),
			marketplace.get('uri'),
			marketplace.get('name'),
			this.getGuestAPIKey()
		);
		Balanced.Utils.setCurrentMarketplace(marketplace);
	},

	addUserMarketplace: function(id, uri, name, secret) {
		var guestMarketplace = Balanced.UserMarketplace.create({
			id: id,
			uri: uri,
			name: name,
			secret: secret
		});

		var userMarketplaces = this.get('user.user_marketplaces');
		var equivalentMarketplace = userMarketplaces.find(function(item) {
			return item.isEqual(guestMarketplace);
		});

		if (!equivalentMarketplace) {
			userMarketplaces.pushObject(guestMarketplace);
		}
	},

	signOut: function() {
		this.forgetLogin();
		this.forgetLastUsedMarketplaceUri();
		var attributes = {
			url: ENV.BALANCED.AUTH + '/logins/current',
			type: 'DELETE'
		};
		return this.request(attributes)
			.then(function() {
				Balanced.NET.loadCSRFToken();
			});
	},

	createNewGuestUser: function() {
		var self = this;
		this.unsetAPIKey();

		return Balanced.APIKey
			.create()
			.save()
			.then(function(apiKey) {
				self.loginGuestUser(apiKey.get('secret'));
				return apiKey;
			});
	},

	getExtensions: function() {
		return ENV.BALANCED.EXT || this.get("user.ext");
	},

	loadExtensions: function() {
		// TODO: reenable extensions
		return Ember.RSVP.resolve();
		/*
		var promises = _.map(this.getExtensions(), function(val, key) {
			var deferred = Ember.RSVP.defer();
			$.getScript(key).always(function() {
				deferred.resolve();
			});
			return deferred.promise;
		});
		return Ember.RSVP.allSettled(promises);
		*/
	},

	enableMultiFactorAuthentication: function() {
		var self = this;
		var attributes = {
			url: this.get('user.multiFactorAuthUri'),
			type: 'POST',
		};

		return this.request(attributes)
			.then(function(response) {
				self.set('OTPSecret', response);
			});
	},

	disableMultiFactorAuthentication: function() {
		var self = this;
		var attributes = {
			url: this.get('user.multiFactorAuthUri'),
			type: 'DELETE',
		};

		return this.request(attributes)
			.then(function() {
				self.set('OTPSecret', null);
				self.set('user.otp_enabled', false);
			});
	},

	confirmOTP: function(token) {
		var self = this;
		var attributes = {
			url: ENV.BALANCED.AUTH + this.get('lastLoginUri'),
			type: 'PUT',
			data: {
				confirm: token
			},
			dataType: 'JSON'
		};
		return this.request(attributes)
			.then(function(response) {
				var user = self.get('user') || Balanced.User.create();
				user.populateFromJsonResponse(response.user);

				if (!self.get('signedIn')) {
					self.setAuthProperties(true,
						user,
						response.user_id,
						response.user_id,
						false,
						response.admin);

					self.rememberLogin(response.uri);
				}
			});
	},

	setAuthProperties: function(signedIn, user, userId, authToken, isGuest, isAdmin) {
		this.setProperties({
			signedIn: signedIn,
			user: user,
			userId: userId,
			authToken: authToken,
			isGuest: isGuest,
			isAdmin: isAdmin
		});

		Balanced.__container__.unregister('user:main');
		Balanced.register('user:main', user, {
			instantiate: false,
			singleton: true
		});
	},

	rememberLogin: function(token) {
		this.set('lastLoginUri', token);

		$.cookie(Balanced.COOKIE.EMBER_AUTH_TOKEN, token, {
			expires: Balanced.TIME.WEEK,
			path: '/'
		});
	},

	forgetLogin: function() {
		_.each([Balanced.COOKIE.EMBER_AUTH_TOKEN, Balanced.COOKIE.API_KEY_SECRET, Balanced.COOKIE.SESSION], function(CONST_VAR) {
			$.removeCookie(CONST_VAR, {
				path: '/'
			});
		});

		this.setProperties({
			lastLoginUri: null,
			OTPSecret: null,
		});

		this.unsetAPIKey();

		this.setAuthProperties(false, null, null, null, false, false);

		Balanced.Utils.setCurrentMarketplace(null);
	},

	setAPIKey: function(apiKeySecret) {
		// Have to use Ember.set since we're using defaultApiKey in bindings
		Ember.set(Balanced.NET, 'defaultApiKey', apiKeySecret);
	},

	unsetAPIKey: function() {
		Ember.set(Balanced.NET, 'defaultApiKey', null);
	},

	storeGuestAPIKey: function(apiKeySecret) {
		$.cookie(Balanced.COOKIE.API_KEY_SECRET, apiKeySecret, {
			path: '/',
			expires: Balanced.TIME.WEEK
		});
	},

	getGuestAPIKey: function() {
		return $.cookie(Balanced.COOKIE.API_KEY_SECRET);
	},

	rememberLastUsedMarketplaceUri: function(marketplaceUri) {
		$.cookie(Balanced.COOKIE.MARKETPLACE_URI, marketplaceUri, {
			path: '/',
			expires: Balanced.TIME.THREE_YEARS
		});
	},

	getLastUsedMarketplaceUri: function() {
		return $.cookie(Balanced.COOKIE.MARKETPLACE_URI);
	},

	forgetLastUsedMarketplaceUri: function() {
		$.removeCookie(Balanced.COOKIE.MARKETPLACE_URI, {
			path: '/'
		});
	}
});

export default auth;
