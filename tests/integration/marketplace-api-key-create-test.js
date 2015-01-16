import Ember from "ember";
import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter, Auth;

module('Integration - Marketplace ApiKeyCreate', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Auth = App.__container__.lookup("auth:main");
		Testing.setupMarketplace();
		BalancedApp.__container__.lookup("controller:sessions")
			.setProperties({
				isUserGuest: false
			});
	},
	teardown: function() {
		Ember.run(App, 'destroy');
	}
});

test("#apply fails person KYC", function() {
	var model;
	visit(Testing.MARKETPLACES_ROUTE)
		.click(".mp-register .info a:contains(Register)")
		.fillForm("#apiKeyCreate", {
			businessType: "person",
			personFullName: "Jimmy Business",
			personDateOfBirth: "11/1980",
			personAddressPostalCode: "99900",
			personSsnLast4: "1111",
			personPhoneNumber: "200-200-2000"
		})
		.then(function() {
			model = BalancedApp.__container__.lookup("controller:modals-container").get("currentModal.model");
			sinon.stub(model, "save").returns(Ember.RSVP.reject(model));
		})
		.click("#apiKeyCreate [name=modal-submit]")
		.then(function() {
			deepEqual(model.save.args, [[]]);
		});
});

test("#apply success", function() {
	var model;
	var controller;
	var stub;
	visit(Testing.MARKETPLACES_ROUTE)
		.click(".mp-register .info a:contains(Register)")
		.fillForm("#apiKeyCreate", {
			businessType: "person",
			personFullName: "Jimmy Business",
			personDateOfBirth: "11/1980",
			personAddressPostalCode: "99900",
			personSsnLast4: "1111",
			personPhoneNumber: "200-200-2000"
		})
		.then(function() {
			controller = BalancedApp.__container__.lookup("controller:modals-container");
			model = controller.get("currentModal.model");
			sinon.stub(controller, "open").returns(Ember.RSVP.resolve());
			sinon.stub(model, "save").returns(Ember.RSVP.resolve(model));
		})
		.click("#apiKeyCreate [name=modal-submit]")
		.then(function() {
			deepEqual(controller.open.args[0][0], "modals/marketplace-create-modal");
			deepEqual(controller.open.args[0][1][0].apiKey, model);
		});
});

test("#marketplace create success", function() {
	var modalsController = BalancedApp.__container__.lookup("controller:modals_container");
	var userMarketplaceController = BalancedApp.__container__.lookup("controller:register-flow/user-marketplace");

	var marketplace = Ember.Object.create({
		getDebuggingProperties: sinon.stub().returns({})
	});
	marketplace.save = sinon.stub().returns(Ember.RSVP.resolve(marketplace));
	sinon.stub(userMarketplaceController, "addApiKeyToCurrentUserFlow").returns(Ember.RSVP.resolve());

	visit(Testing.MARKETPLACES_ROUTE)
		.then(function() {
			var apiKey = Ember.Object.create({
				secret: "ak-test-secretsecret"
			});
			modalsController.open("modals/marketplace-create-modal", [{
				apiKey: apiKey,
				marketplace: marketplace
			}]);
		})
		.fillForm("#marketplaceCreate", {
			name: "merchant.ly",
			domainUrl: "www.merchant.ly",
			supportPhoneNumber: "202-222-3333",
			supportEmailAddress: "tester@example.org",
		})
		.click("#marketplaceCreate [name=isTermsAccepted]")
		.click("#marketplaceCreate [name=modal-submit]")
		.then(function() {
			deepEqual(marketplace.save.args, [[]]);
			deepEqual(userMarketplaceController.addApiKeyToCurrentUserFlow.args, [["ak-test-secretsecret"]]);
		});
});
