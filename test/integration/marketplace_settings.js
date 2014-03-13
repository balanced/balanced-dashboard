var SETTINGS_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/settings';

module('Marketplace Settings', {
	setup: function() {
		Testing.useFixtureData();
	},
	teardown: function() {
		$(".modal").modal('hide');
	}
});

test('can manage users', function(assert) {
	visit(SETTINGS_ROUTE)
		.then(function() {
			assert.equal($('.users-info table tr td.no-results').length, 1, 'No Users shown');
		});
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

	visit(SETTINGS_ROUTE)
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
				Balanced.InviteUser,
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

	visit(SETTINGS_ROUTE)
		.then(function() {
			assert.equal($('.users-info table tr td.no-results').length, 0, 'Users shown');
			assert.equal($('.users-info table tr').length, 1, 'Single Users shown');
		})
		.click('.confirm-delete-user:first')
		.click('.modal.delete-user button[name="modal-submit"]:visible')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.InviteUser));
		});
});
