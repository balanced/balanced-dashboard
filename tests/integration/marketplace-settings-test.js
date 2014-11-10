import Testing from "../helpers/testing";
import startApp from '../helpers/start-app';
import Models from "../helpers/models";
import fixturesAdapter from "../helpers/fixtures-adapter";
import sinonRestore from "../helpers/sinon-restore";

import helpers from "../helpers/helpers";
import checkElements from "../helpers/check-elements";

var App, Auth, Adapter = fixturesAdapter;

module('Integration - Marketplace Settings', {
	setup: function() {
		App = startApp({
			ADAPTER: fixturesAdapter
		});
		Auth = App.__container__.lookup("auth:main");
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.create,
			Adapter.delete
		);
		Ember.run(App, 'destroy');
	}
});

test('can manage users', function() {
	BalancedApp.__container__.lookup("controller:notification_center").clear();

	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/settings")
		.check('.users-info table tr td.no-results', 0)
		.then(function() {
			var $dropdown = $('#user-menu > a.dropdown-toggle');
			notEqual($dropdown.text().trim().length, 0, 'No Email is shown');
		})
		.check('.notification-center-message', 0);
});

test('test marketplace info', function() {
	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/settings")
		.assertDictionaryExists(".dl-horizontal:first", {
			"Marketplace ID": 'FIXTURED-MP4cOZZqeAelhxXQzljLLtgl',
			"Name": 'FIXTURED Marketplace',
			"Support email address": 'support@example.com',
			"Domain URL": 'example.com',
			"Support phone number": '+16505551234'
		});
});

test('can add user', function() {
	var stub = sinon.stub(Adapter, 'create');
	stub.onCall(0).callsArgWith(3, {
		"api_keys": [{
			"links": {},
			"created_at": "2014-03-11T21:21:31.812354Z",
			"secret": "ak-TEST-123",
			"href": "/api_keys/AK123",
			"meta": {
				"name": "AK123"
			},
			"id": "AK123"
		}]
	});

	var TEST_EMAIL = 'Test1234@example.com';

	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/settings")
		.click('.create-user-btn')
		.click('#marketplace-user-create button[name=modal-submit]')
		.then(function() {
			equal(stub.callCount, 0);
		})
		.check('#marketplace-user-create .alert-error', 1)
		.fillIn('#marketplace-user-create [name=email_address]', 'Test1234')
		.click('#marketplace-user-create button[name=modal-submit]')
		.then(function() {
			equal(stub.callCount, 0);
		})
		.check('#marketplace-user-create .alert-error', 1)
		.fillIn('#marketplace-user-create [name=email_address]', TEST_EMAIL)
		.click('#marketplace-user-create button[name=modal-submit]')
		.then(function() {
			ok(stub.calledTwice);
			deepEqual(stub.getCall(0).args.slice(0, 2), [
				Models.lookupFactory("api-key"),
				"/api_keys"
			]);
			matchesProperties(stub.getCall(0).args[2].meta, {
				name: TEST_EMAIL
			});

			deepEqual(stub.getCall(1).args.slice(0, 2), [
				Models.lookupFactory("user-invite"),
				"/marketplaces/FIXTURED-MP4cOZZqeAelhxXQzljLLtgl/users"
			]);
			matchesProperties(stub.getCall(1).args[2], {
				email_address: TEST_EMAIL,
				secret: 'ak-TEST-123'
			});
		});
});

test('can delete user', function() {
	var stub = sinon.stub(Adapter, 'delete');
	var TEST_EMAIL = 'Test1234@example.com';

	var users = [{
		email_address: TEST_EMAIL,
		created_at: "2013-12-18T01:10:23.726770Z",
	}];

	Models.UserMarketplace.reopen({
		users: users
	});

	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/settings")
		.click('.create-user-btn')
		.checkElements({
			'.users-info table tr td.no-results': 0,
			'.users-info table tr': 2
		})
		.click('.confirm-delete-user:first')
		.click('#marketplace-user-delete button[name=modal-submit]');
});
