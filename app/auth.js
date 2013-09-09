Balanced.Auth = (function () {
	var auth = Ember.Object.extend(Ember.Evented).create();

	auth.signIn = function(opts) {
		var self = this;
		if (null == opts) {
			opts = {};
		}

		return Balanced.NET.ajax($.extend(true, {
			url: ENV.BALANCED.AUTH + '/logins',
			type: 'POST'
		}, opts)).done(function (json, status, jqxhr) {
			var user = Balanced.User.create();
			user.set('isNew', false);
			user._updateFromJson(json.user);
			user.set('isLoaded', true);
			user.trigger('didLoad');

			self.setAuthProperties(true,
				user,
				json.user_id,
				json.user_id,
				false);

			auth.rememberLogin(json.uri);

			self.trigger('signInSuccess');
		}).fail(function () {
			self.trigger('signInError');
		}).always(function () {
			self.trigger('signInComplete');
		});
	};

	auth.signOut = function(opts) {
		var self = this;
		if (null == opts) {
			opts = {};
		}

		this.forgetLogin();
		return Balanced.NET.ajax($.extend(true, {
			url: ENV.BALANCED.AUTH + '/logins/current',
			type: 'DELETE'
		}, opts)).done(function () {
			self.trigger('signOutSuccess');
		}).fail(function () {
			self.trigger('signOutError');
		}).always(function () {
			self.trigger('signOutComplete');
		});
	};

	auth.setAuthProperties = function (signedIn, user, userId, authToken, isGuest) {
		auth.set('authToken', authToken);
		auth.set('userId', userId);
		auth.set('signedIn', signedIn);
		auth.set('user', user);
		auth.set('isGuest', isGuest);
	};

	auth.rememberLogin = function (token) {
		$.cookie(Balanced.COOKIE.EMBER_AUTH_TOKEN, token, {
			expires: 1,
			path: '/'
		});
	};

	auth.forgetLogin = function () {
		// Removing from the root domain since we were setting it on the root
		// domain for a while. This line can be removed after Aug 23, 2013
		$.removeCookie(Balanced.COOKIE.EMBER_AUTH_TOKEN, {
			path: '/',
			domain: 'balancedpayments.com'
		});

		$.removeCookie(Balanced.COOKIE.EMBER_AUTH_TOKEN, {
			path: '/'
		});
		auth.destroyGuestUser();
		auth.manualLogout();
	};

	auth.retrieveLogin = function () {
		return $.cookie(Balanced.COOKIE.EMBER_AUTH_TOKEN);
	};

	function loginGuestUser(apiKeySecret) {
		var guestUser = Balanced.User.create({
			user_marketplaces: Ember.A()
		});
		auth.setAuthProperties(true, guestUser, '/users/guest', apiKeySecret, true);
		setAPIKey(apiKeySecret);
	}

	function setAPIKey(apiKeySecret) {
		Balanced.NET.ajaxHeaders['Authorization'] = 'Basic ' + window.btoa(apiKeySecret + ':');
	}

	function unsetAPIKey() {
		delete Balanced.NET.ajaxHeaders['Authorization'];
	}

	function loadGuestAPIKey() {
		return $.cookie(Balanced.COOKIE.API_KEY_SECRET);
	}

	function initGuestUser() {
		var apiKeySecret = loadGuestAPIKey();
		if (apiKeySecret) {
			loginGuestUser(apiKeySecret);
		}
	}

	auth.storeGuestAPIKey = function (apiKeySecret) {
		$.cookie(Balanced.COOKIE.API_KEY_SECRET, apiKeySecret, {
			path: '/'
		});
		loginGuestUser(apiKeySecret);
	};

	auth.getGuestAPIKey = function() {
		return loadGuestAPIKey();
	};

	auth.destroyGuestUser = function () {
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
		Balanced.NET.loadCSRFToken();
		unsetAPIKey();
	};

	auth.manualLogin = function (user, login) {
		auth.destroyGuestUser();
		//  persist cookie for next time
		auth.rememberLogin(login.uri);
		auth.setAuthProperties(true, user, user.uri, login.uri, false);
	};

	auth.manualLogout = function () {
		auth.setAuthProperties(false, null, null, null, false);
	};

	auth.setAPIKey = setAPIKey;
	auth.unsetAPIKey = unsetAPIKey;

	initGuestUser();

	return auth;
}());
