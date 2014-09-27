import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - ResetPassword', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.setupFixtures();
		Testing.logout();
	},
	teardown: function() {
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
		.click("form#reset-password-form button").then(function() {
			equal($(".notification-center.success .message").length, 1, 'The confirmation message is visible');

			ok(spy.calledOnce);
			ok(spy.calledWith(Models.ResetPassword, '/password/abcdefghijklmnopq', sinon.match({
				password: 'abcdef5',
				password_confirm: 'abcdef5',
				token: 'abcdefghijklmnopq'
			})));
		});
});

test('reset password form submits on form submit', function() {
	var spy = sinon.spy(Adapter, "update");

	visit('/password/abcdefghijklmnopq')
		.fillIn("form#reset-password-form input[name=password]", 'abcdef5')
		.fillIn("form#reset-password-form input[name=password_confirm]", 'abcdef5')
		.submitForm("form#reset-password-form").then(function() {
			equal($(".notification-center.success .message").length, 1, 'The confirmation message is visible');

			ok(spy.calledOnce);
			ok(spy.calledWith(Models.ResetPassword, '/password/abcdefghijklmnopq', sinon.match({
				password: 'abcdef5',
				password_confirm: 'abcdef5',
				token: 'abcdefghijklmnopq'
			})));
		});
});
