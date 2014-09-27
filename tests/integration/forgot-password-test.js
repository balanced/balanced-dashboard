import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - ForgotPassword', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.logout();
	},
	teardown: function() {
  Ember.run(App, 'destroy');		
}
});

test('clicking forgot password from login takes you to the page', function() {
	visit('/login')
		.click("form#auth-form a:eq(0)")
		.then(function() {
			equal($("form#forgot-form").length, 1, 'The forgot form exists.');
		});
});

test('forgot password form submits', function() {
	var stub = sinon.stub(Adapter, "create");

	stub.callsArgWith(3, {
		"id": null,
		"email_address": "foo@bar.com"
	});

	visit('/forgot_password')
		.fillForm("#forgot-form", {
			"email_address": "foo@bar.com"
		}, {
			click: "button"
		})
		.onUrl('/login')
		.then(function() {
			equal($(".notification-center.success .message").length, 1, 'The confirmation message is visible');
			ok(stub.calledOnce);
			deepEqual(stub.firstCall.args.slice(1, 3), ["/password", {
				email_address: "foo@bar.com"
			}]);
		});
});

test('displays error message if email address was not found', function() {
	visit('/forgot_password')
		.fillForm("#forgot-form", {
			"email_address": "foo12345@bar.com"
		}, {
			click: "button"
		})
		.then(function() {
			equal($(".notification-center.error .message").length, 1, 'The error message is visible');
		});
});
