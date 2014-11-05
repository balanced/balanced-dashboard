import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter, Auth;

module('Integration - Login', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Auth = App.__container__.lookup("auth:main");
		Testing.setupMarketplace();
	},
	teardown: function() {
		Testing.restoreMethods(
			Auth.signInRequest,
			Auth.request
		);
		Ember.run(App, 'destroy');
	}
});

test('login page exists and has correct fields', function() {
	var spy = sinon.spy(Auth, 'signInRequest');
	Testing.logout();

	visit('/login')
		.checkElements({
			"form#auth-form": 1,
			"form#auth-form input.ember-text-field": 2,
			"form#auth-form button": 1
		})
		.click('form#auth-form button')
		.checkElements({
			"form#auth-form .form-group:first .alert.alert-error": "can't be blank",
			"form#auth-form .form-group:eq(1) .alert.alert-error": "can't be blank"
		})
		.then(function() {
			equal(spy.callCount, 0, 'Login form correctly validated missing information.');
		});
});

test('login page works', function() {
	var spy = sinon.spy(Auth, 'signInRequest');
	Testing.logout();

	visit('/login')
		.fillForm('form#auth-form', {
			email_address: 'user@balancedpayments.com',
			password: '111111'
		}, {
			click: 'button'
		})
		.checkElements({
			".notification-center .message": "The e-mail address or password you entered is invalid."
		})
		.then(function() {
			deepEqual(spy.args, [[{
				"data": {
					"email_address": "user@balancedpayments.com",
					"password": "111111"
				}
			}]]);
		});
});

test('login stay works', function() {
	visit('/login')
		.then(function() {
			var app = BalancedApp.__container__.lookup('controller:application');
			equal(app.get('currentRouteName'), 'login');
		});
});

test('login transition works', function() {
	visit('/start')
		.visit('/login')
		.then(function() {
			var app = BalancedApp.__container__.lookup('controller:application');
			equal(app.get('currentRouteName'), 'login');
		});
});

test('login afterLogin with transition works', 1, function() {
	var promise = Ember.RSVP.resolve({
		"id": "ULxxx",
		"email_address": "xxx@gmail.com",
		"created_at": "2014-04-18T18:38:22.610397",
		"user_id": "USxxx",
		"user_uri": "/users/USxxx",
		"uri": "/logins/ULxxx",
		"session": "xxx",
		"email_hash": "xxx",
		"status": "OK",
		"user": {
			"id": "USxxx",
			"uri": "/users/USxxx",
			"marketplaces_uri": "/users/USxxx/marketplaces",
			"api_keys_uri": "/users/USxxx/api_keys",
			"created_at": "2014-02-04T23:27:46.860461Z",
			"otp_enabled": false,
			"email_address": "xxx@gmail.com",
			"marketplaces": Auth.get('user.user_marketplaces')
		}
	});
	var stub = sinon.stub(Auth, 'request').returns(promise);
	Testing.logout();

	visit(Testing.MARKETPLACE_ROUTE)
		.fillForm("#auth-form", {
			email_address: "guy@example.com",
			password: "111111"
		})
		.click('form#auth-form button')
		.then(function() {
			var app = BalancedApp.__container__.lookup('controller:application');
			equal(app.get('currentRouteName'), "marketplace.orders");
		});
});
