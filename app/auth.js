var auth = Balanced.Auth = Ember.Namespace.extend(Ember.Evented).create({
	_doSignIn: function(opts) {
		var self = this;
		if (null == opts) {
			opts = {};
		}

		return this.request($.extend(true, {
			url: ENV.BALANCED.AUTH + '/logins',
			type: 'POST'
		}, opts), 'signIn', _.bind(this.onSuccessfulLogin, this)).fail(function(jqxhr) {
			if (!jqxhr.responseJSON) {
				return;
			}

			if (jqxhr.responseJSON.response.uri) {
				self.rememberLogin(response.uri);
			}
		});
	},

	onSuccessfulLogin: function(response, status, jqxhr) {
		var user = Balanced.User.create();

		user.populateFromJsonResponse(response.user);

		this.setAuthProperties(true,
			user,
			response.user_id,
			response.user_id,
			false);

		this.rememberLogin(response.uri);
	},

	getCurrentLogin: function() {
		return this.request({
			url: ENV.BALANCED.AUTH + '/logins/current'
		}, 'signIn', _.bind(this.onSuccessfulLogin, this));
	},

	signIn: function(emailAddress, password) {
		return this._doSignIn({
			data: {
				email_address: emailAddress,
				password: password
			}
		});
	},

	rememberMeSignIn: function() {
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
	},

	rememberGuestUser: function(apiKey) {
		var self = this;
		this.setAPIKey(apiKey);

		return Balanced.APIKey.findAll().then(function(apiKeys) {
			var apiKeysWithSecrets = apiKeys.filterBy('secret');
			var secret = apiKeysWithSecrets.length ? apiKeysWithSecrets[0].get('secret') : null;

			self.loginGuestUser(secret);
			return Balanced.Marketplace.findAll().then(function(marketplaces) {
				var marketplace = marketplaces.get('length') ? marketplaces.objectAt(0) : null;
				self.setupGuestUserMarketplace(marketplace);
				return marketplace;
			});
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
		this.setAuthProperties(true, guestUser, '/users/guest', apiKey, true);
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

		if (equivalentMarketplace) {
			return;
		}

		userMarketplaces.pushObject(guestMarketplace);
	},

	signOut: function() {
		var self = this;

		this.forgetLogin();
		this.forgetLastUsedMarketplaceUri();

		return this.request({
			url: ENV.BALANCED.AUTH + '/logins/current',
			type: 'DELETE'
		}, 'signOut', function() {
			Balanced.NET.loadCSRFToken();
		});
	},

	createNewGuestUser: function() {
		this.unsetAPIKey();

		return Balanced.APIKey.create().save().then(function(apiKey) {
			var secret = apiKey.get('secret');
			this.loginGuestUser(secret);
			return apiKey;
		});
	},

	getExtensions: function() {
		var extensions = ENV.BALANCED.EXT || this.get('user.ext');
		if (!extensions || !_.isObject(extensions)) {
			return;
		}

		var exts = _.map(extensions, function(val, key) {
			return $.getScript(key);
		});

		// Ember.RSVP.all(exts).then(_.bind(this.loadAdminExtension, this));
	}.observes('user', 'user.ext', 'ENV.BALANCED.EXT'),

	loadAdminExtension: _.debounce(function() {
		if (!this.get('user') || !this.get('signInTransitionCalled')) {
			return;
		}

		var admin = 'balanced-admin';
		if (this.get('user.admin') && !Balanced.Shapeshifter.isLoaded(admin)) {
			Balanced.Shapeshifter.load(admin);
		} else if (!this.get('user.admin') && Balanced.Shapeshifter.isLoaded(admin)) {
			Balanced.Shapeshifter.unload(admin);
		}
	}, 500).observes('user', 'user.admin'),

	request: function(opts, eventName, successFn) {
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
	},

	enableMultiFactorAuthentication: function() {
		var self = this;

		return this.request({
			url: this.get('user.multiFactorAuthUri'),
			type: 'POST',
		}, 'enableAuth', function(response, status, jqxhr) {
			self.set('OTPSecret', response);
		});
	},

	disableMultiFactorAuthentication: function() {
		var self = this;

		return this.request({
			url: this.get('user.multiFactorAuthUri'),
			type: 'DELETE',
		}, 'disableAuth', function() {
			self.setProperties({
				OTPSecret: null
			});

			self.set('user.otp_enabled', false);
		});
	},

	confirmOTP: function(token) {
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
	},

	setAuthProperties: function(signedIn, user, userId, authToken, isGuest) {
		this.setProperties({
			authToken: authToken,
			userId: userId,
			signedIn: signedIn,
			user: user,
			isGuest: isGuest
		});

		Balanced.__container__.unregister('user:main');
		Balanced.register('user:main', user, {
			instantiate: false,
			singleton: true
		});

		this.getExtensions();
	},

	rememberLogin: function(token) {
		this.set('lastLoginUri', token);

		$.cookie(Balanced.COOKIE.EMBER_AUTH_TOKEN, token, {
			expires: Balanced.TIME.WEEK,
			path: '/'
		});
	},

	forgetLogin: function() {
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

		this.setProperties({
			lastLoginUri: null,
			OTPSecret: null,
			signInTransitionCalled: false
		});

		this.unsetAPIKey();

		this.setAuthProperties(false, null, null, null, false);

		Balanced.Utils.setCurrentMarketplace(null);
	},

	retrieveLogin: function() {
		return $.cookie(Balanced.COOKIE.EMBER_AUTH_TOKEN);
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

Balanced.register('user:main', null, {
	instantiate: false,
	singleton: true
});

Balanced.register('auth:main', Balanced.Auth, {
	instantiate: false,
	singleton: true
});

if (!Balanced.constructor.initializers.injectUser) {
	Balanced.initializer({
		name: 'injectUser',

		initialize: function(container, App) {
			container.typeInjection('controller', 'user', 'user:main');
			container.typeInjection('route', 'user', 'user:main');
		}
	});
}

if (!Balanced.constructor.initializers.injectAuth) {
	Balanced.initializer({
		name: 'injectAuth',

		initialize: function(container, App) {
			container.typeInjection('controller', 'auth', 'auth:main');
			container.typeInjection('route', 'auth', 'auth:main');
		}
	});
}

auth.on('signInTransition', function() {
	auth.set('signInTransitionCalled', true);

	// Delay it for 500ms to give time for any
	// transition to finish loading
	Ember.run.next(function() {
		_.delay(_.bind(auth.loadAdminExtension, auth), 500);
	});
});
