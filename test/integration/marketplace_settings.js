var API_KEY_ROWS = 0;

module('Marketplace Settings', {
	setup: function() {
		Testing.login(true);
	},
	teardown: function() {
		$(".modal").modal('hide');
	}
});

test('can manage api keys', function(assert) {
	visit(Testing.SETTINGS_ROUTE)
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name="modal-submit"]')
		.then(function() {
			API_KEY_ROWS = $('.api-keys-info tr').length;
			assert.ok(API_KEY_ROWS > 1, 'API Key can be created');
		})
		.click('.confirm-delete-key:first')
		.then(function() {
			assert.equal($('.modal.delete-key:visible').length, 1, 'Delete Key confirmation modal should be visible');
		})
		.click('.modal.delete-key:visible button[name="modal-submit"]')
		.then(function() {
			assert.ok(API_KEY_ROWS > $('.api-keys-info tr').length, 'API Key can be deleted');
		});
});

test('can add api key', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, 'create');
	visit(Testing.SETTINGS_ROUTE)
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.APIKey));
			assert.ok(API_KEY_ROWS === $('.api-keys-info tr').length, 'API Key can be created');
		})
		.click('.create-api-key-btn')
		.fillIn('.modal.create-api-key input.full', 'Test1234')
		.click('.modal.create-api-key button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledTwice);
			assert.ok(stub.getCall(1).calledWith(
				sinon.match.any,
				sinon.match.any,
				sinon.match.has('meta', {
					name: 'Test1234'
				})
			));

			assert.ok(API_KEY_ROWS < $('.api-keys-info tr').length, 'API Key can be created');
		})
		.click('.confirm-delete-key:first')
		.then(function() {
			assert.equal($('.modal.delete-key:visible').length, 1, 'Delete Key confirmation modal should be visible');
		})
		.click('.modal.delete-key:visible button[name="modal-submit"]')
		.click('.confirm-delete-key:first')
		.then(function() {
			assert.equal($('.modal.delete-key:visible').length, 1, 'Delete Key confirmation modal should be visible');
		})
		.click('.modal.delete-key:visible button[name="modal-submit"]')
		.then(function() {
			assert.ok(API_KEY_ROWS > $('.api-keys-info tr').length, 'API Key can be deleted');
		});
});

test('adding api key updates auth', function(assert) {
	var testSecret = 'amazing-secret';
	var saveStub = sinon.stub(Balanced.APIKey.prototype, 'save');
	var stub = sinon.stub(Balanced.Adapter, 'create');
	saveStub.returns({
		then: function(callback) {
			callback(Ember.Object.create({
				secret: testSecret
			}));
		}
	});

	visit(Testing.SETTINGS_ROUTE)
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(
				Balanced.UserMarketplace,
				sinon.match.any,
				sinon.match.has('secret', testSecret)
			));
		})
		.click('.confirm-delete-key:first')
		.click('.modal.delete-key button[name="modal-submit"]')
});

// test('cannot delete current api key without a replacement', function(assert) {
// 	visit(Testing.SETTINGS_ROUTE)
// 		.then(function() {
// 			assert.equal($('.confirm-delete-key').length, 0);
// 		})
// 		.click('.create-api-key-btn')
// 		.click('.modal.create-api-key button[name="modal-submit"]')
// 		.then(function() {
// 			assert.equal($('.confirm-delete-key').length, 2);
// 		});
// });
//
// test('can delete api key', function(assert) {
// 	var stub = sinon.stub(Balanced.Adapter, 'delete');
// 	visit(Testing.SETTINGS_ROUTE)
// 		.click('.create-api-key-btn')
// 		.click('.modal.create-api-key button[name="modal-submit"]')
// 		.click('.confirm-delete-key:first')
// 		.click('.modal.delete-key button[name="modal-submit"]:visible')
// 		.then(function() {
// 			assert.ok(stub.calledOnce);
// 			assert.ok(stub.calledWith(Balanced.APIKey));
// 		});
// });
//
// test('can manage users', function(assert) {
// 	visit(Testing.SETTINGS_ROUTE)
// 		.then(function() {
// 			assert.equal($('.users-info table tr td.no-results').length, 1, 'No Users shown');
// 		})
// 		.click('.create-user-btn')
// 		.fillIn('.modal.create-user input.full', 'test@example.com')
// 		.click('.modal.create-user button[name="modal-submit"]')
// 		.then(function() {
// 			assert.equal($('.users-info table tr td.no-results').length, 0, 'No Results hidden');
// 			assert.equal($('.users-info table tr').length, 1, 'Users Created');
// 		})
// 		.click('.confirm-delete-user:first')
// 		.then(function() {
// 			assert.equal($('.modal.delete-user:visible').length, 1, 'Delete User confirmation modal should be visible');
// 		})
// 		.click('.modal.delete-user button[name="modal-submit"]');
// });
//
// test('can add user', function(assert) {
// 	var stub = sinon.stub(Balanced.Adapter, 'create');
//
// 	visit(Testing.SETTINGS_ROUTE)
// 		.click('.create-user-btn')
// 		.click('.modal.create-user button[name="modal-submit"]')
// 		.then(function() {
// 			assert.equal(stub.callCount, 0);
// 			assert.equal($('.modal.create-user:visible .alert-error').length, 1, 'Error on Create Users Modal should be visible');
// 		})
// 		.fillIn('input.full', 'Test1234')
// 		.click('.modal.create-user button[name="modal-submit"]')
// 		.then(function() {
// 			assert.equal(stub.callCount, 0);
// 			assert.equal($('.modal.create-user:visible .alert-error').length, 1, 'Error on Create Users Modal should be visible');
// 		})
// 		.fillIn('input.full', 'Test1234@example.com')
// 		.click('.modal.create-user button[name="modal-submit"]')
// 		.then(function() {
// 			assert.equal(stub.callCount, 0);
// 			assert.equal($('.modal.create-user .alert-error').length, 0, 'Error on Create Users Modal should not be visible');
// 		})
// 		.then(function() {
// 			assert.ok(stub.calledTwice);
// 			console.log(stub.getCall(0));
// 			assert.ok(stub.getCall(0).calledWith(
// 				Balanced.APIKey,
// 				sinon.match.any,
// 				sinon.match.has('meta', {
// 					name: 'Test1234@example.com'
// 				})
// 			));
// console.log(stub.getCall(1));
// 			assert.ok(stub.getCall(1).calledWith(
// 				Balanced.InviteUser,
// 				sinon.match.any,
// 				{
// 					email_address: 'Test1234@example.com',
// 					secret: ''
// 				}
// 			));
//
// 			var userMarketplace = Balanced.Auth.get('user.user_marketplaces')[0];
// 			Ember.run(function() {
// 				return userMarketplace.get('users');
// 			});
//
// 			var users = userMarketplace.get('users');
// 			assert.equal(users.content.length, 1, 'Have No Other Users On Marketplace');
// 		})
// 		.click('.confirm-delete-user:first')
// 		.then(function() {
// 			assert.equal($('.modal.delete-user:visible').length, 1, 'Delete User confirmation modal should be visible');
// 		})
// 		.click('.modal.delete-user button[name="modal-submit"]');
// });
//
// test('can delete user', function(assert) {
// 	var stub = sinon.stub(Balanced.Adapter, 'delete');
// 	visit(Testing.SETTINGS_ROUTE)
// 		.click('.create-user-btn')
// 		.fillIn('input.full', 'Test1234@example.com')
// 		.click('button[name="modal-submit"]')
// 		.click('.confirm-delete-user:first')
// 		.click('.modal.delete-user button[name="modal-submit"]:visible')
// 		.then(function() {
// 			assert.ok(stub.calledOnce);
// 			console.log(stub.getCall(0).args);
// 			assert.ok(stub.calledWith(Balanced.InviteUser));
// 		});
// });
