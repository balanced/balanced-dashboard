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
	"api_keys": [
			{
			"links": {},
			"created_at": "2014-03-11T21:21:31.812354Z",
			"secret": "ak-TEST-123",
			"href": "/api_keys/AK123",
			"meta": {
				"name": "AK123"
			},
			"id": "AK123"
		}
	]});

	var TEST_EMAIL = 'Test1234@example.com';

	visit(SETTINGS_ROUTE)
		.click('.create-user-btn')
		.click('.modal.create-user:visible button[name="modal-submit"]')
		.then(function() {
			assert.equal(stub.callCount, 0);
		})
		.fillIn('.modal.create-user:visible input.full', 'Test1234')
		.click('.modal.create-user button[name="modal-submit"]')
		.then(function() {
			assert.equal(stub.callCount, 0);
		})
		.fillIn('.modal.create-user:visible input.full', TEST_EMAIL)
		.click('.modal.create-user button[name="modal-submit"]')
		.then(function() {
			assert.equal(stub.callCount, 0);
		})
		.then(function() {
			assert.ok(stub.calledTwice);
			assert.ok(stub.getCall(0).calledWith(
				Balanced.APIKey,
				'/api_keys',
				{
					meta: {
						name: TEST_EMAIL
					}
				}
			));
console.log(stub.getCall(1));
			assert.ok(stub.getCall(1).calledWith(
				Balanced.InviteUser,
				sinon.match.any,
				{
					email_address: 'Test1234@example.com',
					secret: ''
				}
			));

			assert.ok(stub.getCall(1).calledWith(
				Balanced.InviteUser,
				sinon.match.any,
				{
					email_address: 'Test1234@example.com',
					secret: ''
				}
			));

			var userMarketplace = Balanced.Auth.get('user.user_marketplaces')[0];
			Ember.run(function() {
				return userMarketplace.get('users');
			});

			var users = userMarketplace.get('users');
			assert.equal(users.content.length, 1, 'Have No Other Users On Marketplace');
		})
		.click('.confirm-delete-user:first')
		.then(function() {
			assert.equal($('.modal.delete-user:visible').length, 1, 'Delete User confirmation modal should be visible');
		})
		.click('.modal.delete-user button[name="modal-submit"]');
});

test('can delete user', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, 'delete');
	visit(SETTINGS_ROUTE)
		.click('.create-user-btn')
		.fillIn('input.full', 'Test1234@example.com')
		.click('.modal.create-user:visible button[name="modal-submit"]')
		.click('.confirm-delete-user:first')
		.click('.modal.delete-user:visible button[name="modal-submit"]:visible')
		.then(function() {
			assert.ok(stub.calledOnce);
			console.log(stub.getCall(0).args);
			assert.ok(stub.calledWith(Balanced.InviteUser));
		});
});
