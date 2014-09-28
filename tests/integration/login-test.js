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
		.then(function() {
			equal($("form#auth-form").length, 1, 'The login form exists.');
			equal($("form#auth-form input.ember-text-field").length, 2, '2 fields exist on the login form.');
			equal($("form#auth-form button").length, 1, 'Submit button exist on the login form.');
		})
		.click('form#auth-form button')
		.then(function() {
			equal(spy.callCount, 1, 'Login form correctly validated missing information.');
			ok($("form#auth-form").hasClass('error'), 'Login form has an error.');
			ok($(".notification-center.error .message").text().trim().toLowerCase().indexOf('is required') >= 0, 'Has error text');
		});
});

test('login form submits correctly', function() {
	var spy = sinon.spy(Auth, 'signInRequest');
	Testing.logout();

	visit('/login')
		.submitForm('form#auth-form')
		.then(function() {
			equal(spy.callCount, 1, 'Login form correctly validated missing information.');
			ok($("form#auth-form").hasClass('error'), 'Login form has an error.');
			ok($(".notification-center.error .message").text().trim().toLowerCase().indexOf('is required') >= 0, 'Has error text');
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
		.then(function() {
			equal(spy.callCount, 1, 'Login form correctly errored.');
			ok($("form#auth-form").hasClass('error'), 'Login form has an error.');
			ok($(".notification-center.error .message").text().trim().toLowerCase().indexOf('invalid') >= 0, 'Has error text');
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
	var loginResponse = {
		"id": "ULxxx",
		"email_address": "xxx@gmail.com",
		"created_at": "2014-04-18T18:38:22.610397",
		"user_id": "USxxx",
		"user_uri": "/users/USxxx",
		"uri": "/logins/ULxxx",
		"session": "xxx",
		"email_hash": "xxx",
		"user": {
			"id": "USxxx",
			"uri": "/users/USxxx",
			"marketplaces_uri": "/users/USxxx/marketplaces",
			"api_keys_uri": "/users/USxxx/api_keys",
			"created_at": "2014-02-04T23:27:46.860461Z",
			"otp_enabled": false,
			"email_address": "xxx@gmail.com",
			"marketplaces": Auth.get('user.user_marketplaces')
		},
		"status": "OK"
	};

	var promise = Ember.RSVP.resolve(loginResponse);
	var stub = sinon.stub(Auth, 'request').returns(promise);

	Testing.logout();
	visit(Testing.MARKETPLACE_ROUTE)
		.click('form#auth-form button')
		.then(function() {
			var app = BalancedApp.__container__.lookup('controller:application');
			equal(app.get('currentRouteName'), "marketplace.transactions");
		});
});
