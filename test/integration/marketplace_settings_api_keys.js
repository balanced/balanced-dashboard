module('Marketplace Settings Api Keys', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createBankAccount();
		Testing.createCard();

		sinon.stub(Ember.Logger, "error");
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.APIKey.prototype.save,
			Balanced.Adapter.create,
			Balanced.Adapter['delete'],
			Balanced.Adapter.update,
			balanced.bankAccount.create,
			balanced.card.create,
			Ember.Logger.error
		);
	}
});

test('can manage api keys', function(assert) {
	Testing.visitSettingsPage()
		.checkElements({
			'.api-keys-info tbody tr': 1
		}, assert)
		.click('.create-api-key-btn')
		.fillIn(".modal.create-api-key", {
			apiKeyName: "Cool Api Key"
		})
		.click('.modal.create-api-key button[name=modal-submit]')
		.checkElements({
			'.api-keys-info tbody tr': 2
		}, assert)
		.click('.confirm-delete-key:first')
		.checkElements({
			'.modal.delete-key:visible': 1
		}, assert)
		.click('.modal.delete-key:visible button[name=modal-submit]')
		.checkElements({
			'.api-keys-info tbody tr': 1
		}, assert);
});

test('can add api key', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, 'create');
	Testing.visitSettingsPage()
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name=modal-submit]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.APIKey));
		})
		.click('.create-api-key-btn')
		.fillIn('.modal.create-api-key input.full', 'Test1234')
		.click('.modal.create-api-key button[name=modal-submit]')
		.then(function() {
			assert.ok(stub.calledTwice);
			assert.ok(stub.getCall(1).calledWith(
				sinon.match.any,
				sinon.match.any,
				sinon.match.has('meta', {
					name: 'Test1234'
				})
			));
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

	Testing.visitSettingsPage()
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name=modal-submit]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(
				Balanced.UserMarketplace,
				sinon.match.any,
				sinon.match.has('secret', testSecret)
			));
		});
});

test('cannot delete current api key without a replacement', function(assert) {
	Testing.visitSettingsPage()
		.checkElements({
			".confirm-delete-key": 0
		}, assert)
		.then(function() {
			assert.equal($('.confirm-delete-key').length, 0);
		})
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name=modal-submit]')
		.checkElements({
			".confirm-delete-key": 2
		}, assert);
});

test('can delete api key', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, 'delete');
	Testing.visitSettingsPage()
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name=modal-submit]')
		.click('.confirm-delete-key:first')
		.click('.modal.delete-key button[name=modal-submit]:visible')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.APIKey));
		});
});
