var SETTINGS_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/settings';

module('Marketplace Settings', {
	setup: function() {
		Testing.useFixtureData();
		this.visitSettingsPage = function() {
			var DISPUTES_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/disputes';
			var disputesController = Balanced.__container__.lookup('controller:marketplace_disputes');
			disputesController.minDate = moment('2013-08-01T00:00:00.000Z').toDate();
			disputesController.maxDate = moment('2013-08-01T23:59:59.999Z').toDate();

			return visit(DISPUTES_ROUTE)
				.then(function() {
					var marketplace = Balanced.__container__.lookup("controller:marketplace").get("model");
					Ember.run(function() {
						var customer = Balanced.Customer.create();
						marketplace.set("owner_customer", customer);
					});
				})
				.then(function() {
					return visit(SETTINGS_ROUTE);
				});
		};
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter.create,
			Balanced.Adapter.delete
		);
	}
});

test('can manage users', function(assert) {
	this.visitSettingsPage()
		.then(function() {
			assert.equal($('.users-info table tr td.no-results').length, 0, '1 User Shown');
			var $dropdown = $('#user-menu > a.dropdown-toggle.gravatar');
			assert.notEqual($dropdown.text().trim().length, 0, 'No Email is shown');
			assert.equal($('.notification-center-message').length, 0, 'Has No Notification');
		});
});

test('test marketplace info', function(assert) {
	this.visitSettingsPage()
		.assertDictionaryExists(".dl-horizontal:first", {
			"Marketplace ID": 'FIXTURED-MP4cOZZqeAelhxXQzljLLtgl',
			"Name": 'FIXTURED Marketplace',
			"Support email address": 'support@example.com',
			"Domain URL": 'example.com',
			"Support phone number": '+16505551234'
		}, assert);
});

test('can add user', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, 'create');
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

	this.visitSettingsPage()
		.click('.create-user-btn')
		.click('.modal.create-user:visible button[name="modal-submit"]')
		.then(function() {
			assert.equal(stub.callCount, 0);
			assert.equal($('.modal.create-user:visible .alert-error').length, 1, 'Error on Create Users Modal should be visible');
		})
		.fillIn('.modal.create-user:visible input.full', 'Test1234')
		.click('.modal.create-user button[name="modal-submit"]')
		.then(function() {
			assert.equal(stub.callCount, 0);
			assert.equal($('.modal.create-user:visible .alert-error').length, 1, 'Error on Create Users Modal should be visible');
		})
		.fillIn('.modal.create-user:visible input.full', TEST_EMAIL)
		.click('.modal.create-user button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledTwice);
			assert.ok(stub.getCall(0).calledWith(
				Balanced.APIKey,
				'/api_keys', {
					meta: {
						name: TEST_EMAIL
					}
				}
			));
			assert.ok(stub.getCall(1).calledWith(
				Balanced.UserInvite,
				sinon.match.any, {
					email_address: TEST_EMAIL,
					secret: 'ak-TEST-123'
				}
			));
		});
});

test('can delete user', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, 'delete');
	var TEST_EMAIL = 'Test1234@example.com';

	var users = [{
		email_address: TEST_EMAIL,
		created_at: "2013-12-18T01:10:23.726770Z",
	}];

	Balanced.UserMarketplace.reopen({
		users: users
	});

	this.visitSettingsPage()
		.checkElements({
			'.users-info table tr td.no-results': 0,
			'.users-info table tr': 2
		}, assert)
		.click('.confirm-delete-user:first')
		.click('.modal.delete-user button[name="modal-submit"]:visible');
});
