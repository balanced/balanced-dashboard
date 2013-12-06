Balanced.Auth = (function() {
	var auth = Ember.Object.extend(Ember.Evented).create();

	auth._doSignIn = function(opts) {
		var self = this;
		if (null == opts) {
			opts = {};
		}

		return Balanced.NET.ajax($.extend(true, {
			url: ENV.BALANCED.AUTH + '/logins',
			type: 'POST'
		}, opts)).done(function(response, status, jqxhr) {
			var user = Balanced.User.create();
			user.populateFromJsonResponse(response.user);

			self.setAuthProperties(true,
				user,
				response.user_id,
				response.user_id,
				false);

			auth.rememberLogin(response.uri);

			self.trigger('signInSuccess');
		}).fail(function() {
			self.trigger('signInError');
		}).always(function() {
			self.trigger('signInComplete');
		});
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
		var authCookie = this.retrieveLogin();
		if (authCookie) {
			return this._doSignIn({
				data: {
					uri: authCookie
				}
			});
		} else {
			var existingApiKey = this.getGuestAPIKey();
			if (existingApiKey) {
				return this.rememberGuestUser(existingApiKey);
			}
		}
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
			marketplaces_uri: '/users/guest/marketplaces'
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
		auth.get('user').get('user_marketplaces').pushObject(guestMarketplace);
	};

	auth.signOut = function() {
		var self = this;

		this.forgetLogin();
		auth.forgetLastUsedMarketplaceUri();
		return Balanced.NET.ajax({
			url: ENV.BALANCED.AUTH + '/logins/current',
			type: 'DELETE'
		}).done(function() {
			Balanced.NET.loadCSRFToken();
			self.trigger('signOutSuccess');
		}).fail(function() {
			self.trigger('signOutError');
		}).always(function() {
			self.trigger('signOutComplete');
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

		_.each(extensions, function(val, key) {
			$.getScript(key);
		});
	}.observes('user', 'user.ext', 'ENV.BALANCED.EXT');

	auth.loadAdminExtension = function() {
		var admin = 'balanced-admin';
		if (auth.get('user.admin') && !Balanced.Shapeshifter.isLoaded(admin)) {
			Balanced.Shapeshifter.load(admin);
		} else if (!auth.get('user.admin') && Balanced.Shapeshifter.isLoaded(admin)) {
			Balanced.Shapeshifter.unload(admin);
		}
	}.observes('user', 'user.admin');

	auth.setAuthProperties = function(signedIn, user, userId, authToken, isGuest) {
		auth.set('authToken', authToken);
		auth.set('userId', userId);
		auth.set('signedIn', signedIn);
		auth.set('user', user);
		auth.set('isGuest', isGuest);

		auth.getExtensions();
		auth.loadAdminExtension();
	};

	auth.rememberLogin = function(token) {
		$.cookie(Balanced.COOKIE.EMBER_AUTH_TOKEN, token, {
			expires: 1,
			path: '/'
		});
	};

	auth.forgetLogin = function() {
		// Removing from the root domain since we were setting it on the root
		// domain for a while. This line can be removed after Aug 23, 2013
		$.removeCookie(Balanced.COOKIE.EMBER_AUTH_TOKEN, {
			path: '/',
			domain: 'balancedpayments.com'
		});

		$.removeCookie(Balanced.COOKIE.EMBER_AUTH_TOKEN, {
			path: '/'
		});

		$.removeCookie(Balanced.COOKIE.API_KEY_SECRET, {
			path: '/'
		});
		$.removeCookie(Balanced.COOKIE.API_KEY_SECRET, {
			path: '/',
			domain: 'balancedpayments.com'
		});

		$.removeCookie(Balanced.COOKIE.SESSION, {
			path: '/'
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
			path: '/'
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

	return auth;
}());
