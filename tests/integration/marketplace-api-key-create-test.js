import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Marketplace ApiKeyCreate', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		BalancedApp.__container__.lookup("controller:sessions")
			.setProperties({
				isUserGuest: false
			});
	},
	teardown: function() {
		Testing.restoreMethods($.ajax);
		Ember.run(App, 'destroy');
	}
});

test("#apply fails person KYC", function() {
	var stub;
	visit(Testing.MARKETPLACES_ROUTE)
		.click(".mp-register .info a:contains(Register)")
		.fillForm("#apiKeyCreate", {
			person_name: "Jimmy Business",
			dobYear: "1980",
			dobMonth: "11",
			person_postal_code: "99900",
			person_ssn_last_4: "1111",
			merchant_phone_number: "200-200-2000"
		})
		.then(function() {
			stub = sinon.stub(jQuery, "ajax");
			stub.returns(Ember.RSVP.reject({
				responseJSON: {
					"category_code": "person-kyc",
					"friendly_html": "",
					"redirect_uri": "https://www.balancedpayments.com/marketplaces/promote",
					"category_type": "redirect",
					"description": "Person KYC failed."
				}
			}));
		})
		.click("#apiKeyCreate [name=modal-submit]")
		.then(function() {
			deepEqual(JSON.parse(stub.args[0][0].data), {
				merchant: {
					dob: "1980-11",
					name: "Jimmy Business",
					phone_number: "200-200-2000",
					postal_code: "99900",
					production: true,
					ssn_last_4: "1111",
					type: "person"
				}
			});
			stub.restore();
		})
		.checkElements({
			"#apiKeyCreate .notification-center.error": "We could not verify your identity. Please check your information again and resubmit."
		});
});

test("#apply success", function() {
	var modalsController = BalancedApp.__container__.lookup("controller:modals_container");
	var openModalStub;
	var stub;
	visit(Testing.MARKETPLACES_ROUTE)
		.click(".mp-register .info a:contains(Register)")
		.fillForm("#apiKeyCreate", {
			person_name: "Jimmy Business",
			dobYear: "1980",
			dobMonth: "11",
			person_postal_code: "99900",
			person_ssn_last_4: "1111",
			merchant_phone_number: "200-200-2000"
		})
		.then(function() {
			stub = sinon.stub(jQuery, "ajax");
			stub.returns(Ember.RSVP.resolve({
				"links": {},
				"api_keys": [{
					"links": {},
					"created_at": "2014-08-20T18:51:08.255494Z",
					"secret": "ak-test-secretsecret",
					"href": "/api_keys/AKxxxxxxxxxxxxx",
					"meta": {},
					"id": "AKxxxxxxxxxxxxx"
				}]
			}));
			openModalStub = sinon.spy(modalsController, "open");
		})
		.click("#apiKeyCreate [name=modal-submit]")
		.then(function() {
			deepEqual(JSON.parse(stub.args[0][0].data), {
				merchant: {
					dob: "1980-11",
					name: "Jimmy Business",
					phone_number: "200-200-2000",
					postal_code: "99900",
					production: true,
					ssn_last_4: "1111",
					type: "person"
				}
			});
			stub.restore();
			deepEqual(openModalStub.args, [
				[
					Models.MarketplaceCreateModalView, ["ak-test-secretsecret"]
				]
			]);
			openModalStub.restore();
		});
});

test("#marketplace create success", function() {
	var modalsController = BalancedApp.__container__.lookup("controller:modals_container");
	var stub;
	var pushMarketplaceStub;
	var dummyMarketplace = Ember.Object.create();

	visit(Testing.MARKETPLACES_ROUTE)
		.then(function() {
			modalsController.open(Models.MarketplaceCreateModalView, ["ak-test-secretsecret"]);
		})
		.fillForm("#marketplaceCreate", {
			name: "merchant.ly",
			domain_url: "www.merchant.ly",
			support_phone_number: "202-222-3333",
			support_email_address: "tester@example.org",
		})
		.click("#marketplaceCreate [name=isTermsAccepted]")
		.then(function() {
			var mpController = BalancedApp.__container__.lookup("controller:user_marketplace");

			stub = sinon.stub(jQuery, "ajax");
			stub.returns(Ember.RSVP.resolve({
				"marketplaces": [{
					href: "/marketplaces/MPxxxxxxxxxxx"
				}]
			}));

			pushMarketplaceStub = sinon.stub(mpController, "pushMarketplace");
			pushMarketplaceStub.returns(Ember.RSVP.resolve(dummyMarketplace));
		})
		.click("#marketplaceCreate [name=modal-submit]")
		.then(function() {
			deepEqual(JSON.parse(stub.args[0][0].data), {
				name: "merchant.ly",
				domain_url: "www.merchant.ly",
				support_phone_number: "202-222-3333",
				support_email_address: "tester@example.org"
			}, "Submitted data is correct");

			deepEqual(pushMarketplaceStub.args, [
				[Auth.get("user"), "ak-test-secretsecret", "/marketplaces/MPxxxxxxxxxxx"]
			], "Marketplace link data is correct");
		})
		.then(function() {
			stub.restore();
			pushMarketplaceStub.restore();
		});
});
