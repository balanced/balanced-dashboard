import Ember from "ember";
import { test } from 'ember-qunit';
import Testing from "../helpers/testing";
import startApp from '../helpers/start-app';

require("balanced-dashboard/tests/helpers/helpers");

var BalancedApp;

module('Account Security', {
	setup: function() {
		BalancedApp = startApp();
		Testing.useFixtureData();
	},
	teardown: function() {
		Ember.run(BalancedApp, BalancedApp.destroy);
	}
});

var getAuth = function() {
	return BalancedApp.__container__.lookup("auth:main");
};

test('Can enable', function() {
	var spy = sinon.stub(getAuth(), 'request')
		.returns(Ember.RSVP.resolve({
			id: "USxxxxxxxxxxxxxxx",
			secret: "VERYSECRET",
			secret_uri: "otpauth://xxxxxxxxxxxxxxxxxxxxxxx"
		}));

	visit('/security')
		.checkElements({
			"h1.page-title": 'Account Security',
			"#account_security.disabled": 1,
			".status-circle:visible": 2,
			".window-pane:visible": 0
		})
		.then(function() {
			var currentRoute = BalancedApp.__container__.lookup('route:accountSecurity');
			equal(currentRoute.previousHandler.name, 'login', 'Route to go back correct');
		})
		.click('.status-circle.green a')
		.then(function() {
			equal(spy.callCount, 1, 'Enabled');
		});
});

test('Can see change password modal', function() {
	visit('/security')
		.click('#user-menu .change-password a')
		.checkElements({
			'.change-password-modal.modal:visible': 1
		});
});

test('Can see change email modal', function() {
	visit('/security')
		.click('#user-menu .change-email a')
		.checkElements({
			'.change-email-modal.modal:visible': 1
		});
});

test('Can disable', function() {
	var Auth = getAuth();
	var spy = sinon.stub(Auth, 'request')
		.returns(Ember.RSVP.resolve());
	Auth.set('user.otp_enabled', true);

	visit('/security')
		.checkElements({
			"h1.page-title": 'Account Security',
			"#account_security.enabled": 1,
			".status-circle:visible": 2,
			".window-pane:visible": 0
		})
		.then(function() {
			var currentRoute = BalancedApp.__container__.lookup('route:account-security');
			equal(currentRoute.previousHandler.name, 'login', 'Route to go back correct');
		})
		.click('.status-circle.red a')
		.checkElements({
			'#disable-mfa:visible': 1
		})
		.click('#disable-mfa button[name=modal-submit]')
		.then(function() {
			equal(spy.callCount, 1, 'Disabled');
		});
});
