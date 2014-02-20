Balanced.Auth = (function() {
	var auth = Ember.Object.extend(Ember.Evented).create();

	auth._doSignIn = function(opts) {
		var self = this;
		if (null == opts) {
			opts = {};
		}

		return this.request($.extend(true, {
			url: ENV.BALANCED.AUTH + '/logins',
			type: 'POST'
		}, opts), 'signIn', this.onSuccessfulLogin).fail(function(jqxhr) {
			if (typeof jqxhr.responseText !== "undefined") {
				var response = JSON.parse(jqxhr.responseText);

				if (response.uri) {
					self.rememberLogin(response.uri);
				}
			}
		});
	};

	auth.onSuccessfulLogin = _.bind(function(response, status, jqxhr) {
		var user = Balanced.User.create();

		user.populateFromJsonResponse(response.user);

		this.setAuthProperties(true,
			user,
			response.user_id,
			response.user_id,
			false);

		this.rememberLogin(response.uri);
	}, auth);

	auth.getCurrentLogin = function() {
		return this.request({
			url: ENV.BALANCED.AUTH + '/logins/current'
		}, 'signIn', this.onSuccessfulLogin);
	};

	auth.signIn = function(emailAddress, password) {
		return this._doSignIn({
			data: {
				email_address: emailAddress,
				password: password
			}
		});
	};

	auth.rememberMeSignIn = function() {
		var self = this;

		this.getCurrentLogin().fail(function() {
			// Can't remove this code
			// This code checks the current auth token
			var authCookie = self.retrieveLogin();

			if (authCookie) {
				return self._doSignIn({
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
	};

	auth.rememberGuestUser = function(apiKey) {
		this.setAPIKey(apiKey);

		return Balanced.APIKey.findAll().then(function(apiKeys) {
			var apiKeysWithSecrets = apiKeys.filterBy('secret');
			var secret = apiKeysWithSecrets.length ? apiKeysWithSecrets[0].get('secret') : null;

			auth.loginGuestUser(secret);
			return Balanced.Marketplace.findAll().then(function(marketplaces) {
				var marketplace = marketplaces.get('length') ? marketplaces.objectAt(0) : null;
				auth.setupGuestUserMarketplace(marketplace);
				return marketplace;
			});
		});
	};

	auth.loginGuestUser = function(apiKey) {
		auth.storeGuestAPIKey(apiKey);
		auth.setAPIKey(apiKey);

		var guestUser = Balanced.User.create({
			user_marketplaces: Ember.A(),
			marketplaces_uri: '/users/guest/marketplaces',
			api_keys_uri: '/users/guest/api_keys'
		});
		auth.setAuthProperties(true, guestUser, '/users/guest', apiKey, true);
	};

	auth.setupGuestUserMarketplace = function(marketplace) {
		auth.addUserMarketplace(
			marketplace.get('id'),
			marketplace.get('uri'),
			marketplace.get('name'),
			auth.getGuestAPIKey()
		);
		Balanced.Utils.setCurrentMarketplace(marketplace);
	};

	auth.addUserMarketplace = function(id, uri, name, secret) {
		var guestMarketplace = Balanced.UserMarketplace.create({
			id: id,
			uri: uri,
			name: name,
			secret: secret
		});

		var userMarketplaces = auth.get('user.user_marketplaces');
		var equivalentMarketplace = userMarketplaces.find(function(item) {
			return item.isEqual(guestMarketplace);
		});

		if (equivalentMarketplace) {
			return;
		}

		userMarketplaces.pushObject(guestMarketplace);
	};

	auth.signOut = function() {
		var self = this;

		this.forgetLogin();
		auth.forgetLastUsedMarketplaceUri();

		return this.request({
			url: ENV.BALANCED.AUTH + '/logins/current',
			type: 'DELETE'
		}, 'signOut', function() {
			Balanced.NET.loadCSRFToken();
		});
	};

	auth.createNewGuestUser = function() {
		Balanced.Auth.unsetAPIKey();
		return Balanced.APIKey.create().save().then(function(apiKey) {
			var secret = apiKey.get('secret');
			auth.loginGuestUser(secret);
			return apiKey;
		});
	};

	auth.getExtensions = function() {
		var extensions = ENV.BALANCED.EXT || auth.get('user.ext');
		if (!extensions || !_.isObject(extensions)) {
			return;
		}

		var exts = _.map(extensions, function(val, key) {
			return $.getScript(key);
		});

		// Ember.RSVP.all(exts).then(_.bind(auth.loadAdminExtension, auth));
	}.observes('user', 'user.ext', 'ENV.BALANCED.EXT');

	auth.loadAdminExtension = _.debounce(function() {
		if (!auth.get('user') || !auth.get('signInTransitionCalled')) {
			return;
		}

		var admin = 'balanced-admin';
		if (auth.get('user.admin') && !Balanced.Shapeshifter.isLoaded(admin)) {
			Balanced.Shapeshifter.load(admin);
		} else if (!auth.get('user.admin') && Balanced.Shapeshifter.isLoaded(admin)) {
			Balanced.Shapeshifter.unload(admin);
		}
	}, 500).observes('user', 'user.admin');

	auth.on('signInTransition', function() {
		auth.set('signInTransitionCalled', true);

		// Delay it for 500ms to give time for any
		// transition to finish loading
		Ember.run.next(function() {
			_.delay(_.bind(auth.loadAdminExtension, auth), 500);
		});
	});

	auth.request = function(opts, eventName, successFn) {
		var self = this;

		if (!opts) {
			opts = {};
		}

		return Balanced.NET.ajax(opts).done(successFn)
			.done(function(response, status, jqxhr) {
				self.trigger(eventName + 'Success');
			}).fail(function() {
				self.trigger(eventName + 'Error');
			}).always(function() {
				self.trigger(eventName + 'Complete');
			});
	};

	auth.enableMultiFactorAuthentication = function() {
		var self = this;

		return this.request({
			url: this.get('user.multiFactorAuthUri'),
			type: 'POST',
			dataType: 'JSON'
		}, 'enableAuth', function(response, status, jqxhr) {
			self.set('OTPSecret', response);
		});
	};

	auth.disableMultiFactorAuthentication = function() {
		var self = this;

		return this.request({
			url: this.get('user.multiFactorAuthUri'),
			type: 'DELETE',
			dataType: 'JSON'
		}, 'disableAuth', function() {
			self.setProperties({
				OTPSecret: null
			});

			self.set('user.otp_enabled', false);
			// auth.forgetLogin();
		});
	};

	auth.confirmOTP = function(token) {
		var self = this;

		return this.request({
			url: ENV.BALANCED.AUTH + this.get('lastLoginUri'),
			type: 'PUT',
			data: {
				confirm: token
			},
			dataType: 'JSON'
		}, 'confirmOTP', function(response, status, jqxhr) {
			var user = self.get('user') || Balanced.User.create();
			user.populateFromJsonResponse(response.user);

			if (!self.get('signedIn')) {
				self.setAuthProperties(true,
					user,
					response.user_id,
					response.user_id,
					false);

				self.rememberLogin(response.uri);
			}
		});
	};

	auth.setAuthProperties = function(signedIn, user, userId, authToken, isGuest) {
		auth.setProperties({
			authToken: authToken,
			userId: userId,
			signedIn: signedIn,
			user: user,
			isGuest: isGuest
		});

		Balanced.__container__.unregister('user:main');
		Balanced.register('user:main', user || {}, {
			instantiate: false,
			singleton: true
		});

		auth.getExtensions();
	};

	auth.rememberLogin = function(token) {
		auth.set('lastLoginUri', token);

		$.cookie(Balanced.COOKIE.EMBER_AUTH_TOKEN, token, {
			expires: Balanced.TIME.WEEK,
			path: '/'
		});
	};

	auth.forgetLogin = function() {
		// Removing from the root domain since we were setting it on the root
		// domain for a while. This line can be removed after Aug 23, 2013
		_.each([Balanced.COOKIE.EMBER_AUTH_TOKEN, Balanced.COOKIE.API_KEY_SECRET, Balanced.COOKIE.SESSION], function(CONST_VAR) {
			$.removeCookie(CONST_VAR, {
				path: '/'
			});

			// Just to be sure
			$.removeCookie(CONST_VAR, {
				path: '/',
				domain: 'balancedpayments.com'
			});
		});

		auth.setProperties({
			lastLoginUri: null,
			OTPSecret: null,
			signInTransitionCalled: false
		});

		auth.unsetAPIKey();

		auth.setAuthProperties(false, null, null, null, false);

		Balanced.Utils.setCurrentMarketplace(null);
	};

	auth.retrieveLogin = function() {
		return $.cookie(Balanced.COOKIE.EMBER_AUTH_TOKEN);
	};

	auth.setAPIKey = function(apiKeySecret) {
		// Have to use Ember.set since we're using defaultApiKey in bindings
		Ember.set(Balanced.NET, 'defaultApiKey', apiKeySecret);
	};

	auth.unsetAPIKey = function() {
		Ember.set(Balanced.NET, 'defaultApiKey', null);
	};

	auth.storeGuestAPIKey = function(apiKeySecret) {
		$.cookie(Balanced.COOKIE.API_KEY_SECRET, apiKeySecret, {
			path: '/',
			expires: Balanced.TIME.WEEK
		});
	};

	auth.getGuestAPIKey = function() {
		return $.cookie(Balanced.COOKIE.API_KEY_SECRET);
	};

	auth.rememberLastUsedMarketplaceUri = function(marketplaceUri) {
		$.cookie(Balanced.COOKIE.MARKETPLACE_URI, marketplaceUri, {
			path: '/',
			expires: Balanced.TIME.THREE_YEARS
		});
	};

	auth.getLastUsedMarketplaceUri = function() {
		return $.cookie(Balanced.COOKIE.MARKETPLACE_URI);
	};

	auth.forgetLastUsedMarketplaceUri = function() {
		$.removeCookie(Balanced.COOKIE.MARKETPLACE_URI, {
			path: '/'
		});
	};

	Balanced.register('user:main', {}, {
		instantiate: false,
		singleton: true
	});

	Balanced.register('auth:main', auth, {
		instantiate: false,
		singleton: true
	});

	Balanced.initializer({
		name: 'injectUser',

		initialize: function(container, App) {
			container.typeInjection('controller', 'user', 'user:main');
			container.typeInjection('route', 'user', 'user:main');
		}
	});

	Balanced.initializer({
		name: 'injectAuth',

		initialize: function(container, App) {
			container.typeInjection('controller', 'auth', 'auth:main');
			container.typeInjection('route', 'auth', 'auth:main');
		}
	});

	return auth;
}());
