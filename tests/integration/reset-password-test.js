import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";
import fixturesAdapter from "../helpers/fixtures-adapter";

import Models from "../helpers/models";

var App, Auth, Adapter = fixturesAdapter;

module('Integration - ResetPassword', {
	setup: function() {
		App = startApp({
			ADAPTER: fixturesAdapter
		});
		Auth = App.__container__.lookup("auth:main");
	},
	teardown: function() {
		Testing.restoreMethods(Adapter.update);
		Ember.run(App, 'destroy');
	}
});

test('reset password page exists', function() {
	visit('/password/abcdefghijklmnopq').then(function() {
		equal($("form#reset-password-form").length, 1, 'The reset password form exists.');
	});
});

test('setting a weak password should error', function() {
	visit('/password/abcdefghijklmnopq')
		.fillIn("form#reset-password-form input[name=password]", '123456')
		.fillIn("form#reset-password-form input[name=password_confirm]", '123456')
		.click("form#reset-password-form button")
		.then(function() {
			equal($("form#reset-password-form").hasClass('error'), true, 'reset password form should have error class');
		});
});

test('reset password form submits on button click', function() {
	var spy = sinon.spy(Adapter, "update");

	visit('/password/abcdefghijklmnopq')
		.fillIn("form#reset-password-form input[name=password]", 'abcdef5')
		.fillIn("form#reset-password-form input[name=password_confirm]", 'abcdef5')
		.click("form#reset-password-form button")
		.check(".notification-center.success .message", 1, 'The confirmation message is visible')
		.then(function() {
			var ResetPassword = BalancedApp.__container__.lookupFactory("model:reset-password") ;
			var args = spy.firstCall.args;

			ok(spy.calledOnce, "Called once");
			deepEqual(args.slice(0, 2), [ResetPassword, '/password/abcdefghijklmnopq'], "Arguments match");
			matchesProperties(args[2], {
				password: 'abcdef5',
				password_confirm: 'abcdef5',
				token: 'abcdefghijklmnopq'
			});
		});
});
