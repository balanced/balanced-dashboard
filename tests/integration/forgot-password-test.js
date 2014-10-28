import startApp from '../helpers/start-app';
import fixturesAdapter from "../helpers/fixtures-adapter";
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - ForgotPassword', {
	setup: function() {
		App = startApp({
			ADAPTER: fixturesAdapter
		});
		Adapter = App.__container__.lookup("adapter:main");
		Testing.logout();
	},
	teardown: function() {
		Testing.restoreMethods(Adapter.create);
		Ember.run(App, 'destroy');
	}
});

test('clicking forgot password from login takes you to the page', function() {
	visit('/login')
		.click("form#auth-form a:eq(0)")
		.check("form#forgot-form", 1);
});

test('forgot password form submits', function() {
	var stub = sinon.stub(Adapter, "create");

	stub.callsArgWith(3, {
		"id": null,
		"email_address": "foo@bar.com"
	});

	visit('/login')
		.click("form#auth-form a:eq(0)")
		.fillForm("#forgot-form", {
			"email_address": "foo@bar.com"
		}, {
			click: "button"
		})
		.onUrl('/login')
		.check(".notification-center.success .message", 1, 'The confirmation message is visible')
		.then(function() {
			ok(stub.calledOnce);
			deepEqual(stub.firstCall.args[1], "/password");
			matchesProperties(stub.firstCall.args[2], {
				email_address: "foo@bar.com"
			});
		});
});

test('displays error message if email address was not found', function() {
	visit('/login')
		.click("form#auth-form a:eq(0)")
		.fillForm("#forgot-form", {
			"email_address": "foo12345@bar.com"
		})
		.then(function() {
			var c = BalancedApp.__container__.lookup("controller:forgot-password");
			var m = c.get("model");
			sinon.stub(m, "save").returns(Ember.RSVP.reject({
				detail: "Not found"
			}));
		})
		.click("#forgot-form button")
		.check(".notification-center.error .message", 1, 'The confirmation message is visible');
});
