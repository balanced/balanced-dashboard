import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Guest', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
	},
	teardown: function() {
		Ember.run(App, 'destroy');
	}
});

test('visiting start creates a marketplace', function() {
	visit('/start')
		.then(function() {
			var session = BalancedApp.__container__.lookup("controller:sessions");

			deepEqual(session.getProperties("isUserGuest", "isUserPresent"), {
				isUserPresent: true,
				isUserGuest: true
			});
		});
});

test('viewing settings page as guest, can view api secret key', function() {
	visit('/marketplaces/' + Testing.MARKETPLACE_ID)
		.then(function() {
			var marketplace = BalancedApp.__container__.lookup("controller:marketplace").get("model");
			Ember.run(function() {
				var customer = Models.Customer.create();
				marketplace.set("owner_customer", customer);
			});
		})
		.click('#marketplace-nav i.icon-settings')
		.click(".api-key-secret a")
		.then(function() {
			var shownApiSecretKey = $.trim($('.api-key-secret').text());
			deepEqual(shownApiSecretKey.slice(0, 8), "ak-test-");
		});
});

test('claim account creates a login', function() {
	var stub;

	var emailAddress = 'marshall@example.com',
		password = 'SupahSecret123~!';

	visit('/start')
		.checkElements({
			"#account-create h2": "Balanced Dashboard",
			"#account-create .form-section h3": "Create your account"
		})
		.fillForm("#account-create", {
			email_address: emailAddress,
			password: password,
			passwordConfirm: password
		})
		.then(function() {
			stub = sinon.stub(jQuery, "ajax");
			stub.returns(Ember.RSVP.resolve({
				uri: "",
			}));
		})
		.click('#account-create [name=modal-submit]')
		.then(function() {
			var request = stub.args[0][0];
			matchesProperties(request, {
				type: "POST",
				url: "https://auth.balancedpayments.com/users",
			});
			deepEqual(request.data, {
				"email_address": "marshall@example.com",
				"password": "SupahSecret123~!",
				"passwordConfirm": "SupahSecret123~!"
			});
			stub.restore();
		});
});
