import startApp from '../helpers/start-app';
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
	Testing.visitSettingsPage()
		.then(function() {
			equal($('.users-info table tr td.no-results').length, 0, '1 User Shown');
			var $dropdown = $('#user-menu > a.dropdown-toggle.gravatar');
			notEqual($dropdown.text().trim().length, 0, 'No Email is shown');
			equal($('.notification-center-message').length, 0, 'Has No Notification');
		});
});

test('test marketplace info', function() {
	Testing.visitSettingsPage()
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

	Testing.visitSettingsPage()
		.click('.create-user-btn')
		.click('.modal.create-user:visible button[name="modal-submit"]')
		.then(function() {
			equal(stub.callCount, 0);
			equal($('.modal.create-user:visible .alert-error').length, 1, 'Error on Create Users Modal should be visible');
		})
		.fillIn('.modal.create-user:visible input.full', 'Test1234')
		.click('.modal.create-user button[name="modal-submit"]')
		.then(function() {
			equal(stub.callCount, 0);
			equal($('.modal.create-user:visible .alert-error').length, 1, 'Error on Create Users Modal should be visible');
		})
		.fillIn('.modal.create-user:visible input.full', TEST_EMAIL)
		.click('.modal.create-user button[name="modal-submit"]')
		.then(function() {
			ok(stub.calledTwice);
			ok(stub.getCall(0).calledWith(
				Models.APIKey,
				'/api_keys', {
					meta: {
						name: TEST_EMAIL
					}
				}
			));
			ok(stub.getCall(1).calledWith(
				Models.UserInvite,
				sinon.match.any, {
					email_address: TEST_EMAIL,
					secret: 'ak-TEST-123'
				}
			));
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

	Testing.visitSettingsPage()
		.checkElements({
			'.users-info table tr td.no-results': 0,
			'.users-info table tr': 2
		})
		.click('.confirm-delete-user:first')
		.click('.modal.delete-user button[name="modal-submit"]:visible');
});
