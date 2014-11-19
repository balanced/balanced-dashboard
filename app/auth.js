import ENV from "balanced-dashboard/config/environment";
import Ember from "ember";
import Utils from "./lib/utils";
import Marketplace from "balanced-dashboard/models/marketplace";

import Constants from "./utils/constants";
import CookieConstants from "./utils/constants/cookie";
import Ajax from "balanced-dashboard/lib/ajax";

import ApiKey from "./models/api-key";

var createInstance = function(name, attributes) {
	return BalancedApp.__container__.lookupFactory(name).create(attributes);
};

var Auth = Ember.Namespace.extend(Ember.Evented).create({
	loadCsrfTokenIfNotLoaded: function() {
		return Ajax.loadCSRFTokenIfNotLoaded();
	},
	request: function(opts) {
		return Ajax.ajax(opts || {});
	},
	signInRequest: function(options) {
		var self = this;
		var attributes = _.extend({}, {
			url: ENV.BALANCED.AUTH + '/logins',
			type: 'POST'
		}, options);
		return this.request(attributes)
			.then(function(response) {
				var user = createInstance("model:user");
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
				if (user.get("admin")) {
					self.setAPIKey(user.get("admin"));
				}
				return user;
			})
			.then(function(user) {
				var AnalyticsLogger = require("balanced-dashboard/utils/analytics_logger")["default"];
				AnalyticsLogger.identify(user);
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
				var authCookie = $.cookie(CookieConstants.EMBER_AUTH_TOKEN);
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

		return ApiKey.findAll()
			.then(function(apiKeys) {
				var apiKeysWithSecrets = apiKeys.filterBy('secret');
				var secret = apiKeysWithSecrets.length ? apiKeysWithSecrets[0].get('secret') : null;
				self.loginGuestUser(secret);
				return Marketplace.findAll();
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

		var guestUser = createInstance("model:user", {
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
		Utils.setCurrentMarketplace(marketplace);
	},

	addUserMarketplace: function(id, uri, name, secret) {
		var guestMarketplace = createInstance("model:user-marketplace", {
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
				Ajax.loadCSRFToken();
			});
	},

	createNewGuestUser: function() {
		var self = this;
		this.unsetAPIKey();

		return ApiKey
			.create()
			.save()
			.then(function(apiKey) {
				self.loginGuestUser(apiKey.get('secret'));
				return apiKey;
			});
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

	setAuthPropertiesFromSession: function(session) {
		var user = session.get("user");
		var userId = session.get("userId");
		var uri = session.get("uri");
		var isAdmin = session.get("isAdmin");
		var isGuest = session.get("isGuest");

		this.setAuthProperties(true, user, userId, userId, isGuest, isAdmin);
		this.rememberLogin(uri);
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

		this.applicationContainer.unregister('user:main');
		this.applicationContainer.register('user:main', user, {
			instantiate: false,
			singleton: true
		});
	},

	rememberLogin: function(token) {
		this.set('lastLoginUri', token);

		$.cookie(CookieConstants.EMBER_AUTH_TOKEN, token, {
			expires: Constants.TIME.WEEK,
			path: '/'
		});
	},

	forgetLogin: function() {
		_.each([CookieConstants.EMBER_AUTH_TOKEN, CookieConstants.API_KEY_SECRET, CookieConstants.SESSION], function(CONST_VAR) {
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

		Utils.setCurrentMarketplace(null);
	},

	setAPIKey: function(apiKeySecret) {
		// Have to use Ember.set since we're using defaultApiKey in bindings
		Ember.set(Ajax, 'defaultApiKey', apiKeySecret);
	},

	unsetAPIKey: function() {
		Ember.set(Ajax, 'defaultApiKey', null);
	},

	storeGuestAPIKey: function(apiKeySecret) {
		$.cookie(CookieConstants.API_KEY_SECRET, apiKeySecret, {
			path: '/',
			expires: Constants.TIME.WEEK
		});
	},

	getGuestAPIKey: function() {
		return $.cookie(CookieConstants.API_KEY_SECRET);
	},

	rememberLastUsedMarketplaceUri: function(marketplaceUri) {
		$.cookie(CookieConstants.MARKETPLACE_URI, marketplaceUri, {
			path: '/',
			expires: Constants.TIME.THREE_YEARS
		});
	},

	getLastUsedMarketplaceUri: function() {
		return $.cookie(CookieConstants.MARKETPLACE_URI);
	},

	forgetLastUsedMarketplaceUri: function() {
		$.removeCookie(CookieConstants.MARKETPLACE_URI, {
			path: '/'
		});
	}
});

export default Auth;
