module('Marketplace Settings Webhooks', {
	setup: function() {
		Testing.setupMarketplace();

		Ember.run(function() {
			Balanced.Callback.create({
				uri: '/callbacks',
				url: 'http://api.com/something',
				revision: '1.0'
			}).save();
		});

		sinon.stub(Ember.Logger, "error");
	},
	teardown: function() {
		Testing.restoreMethods(
			BalancedApp.Adapter.create,
			BalancedApp.Adapter['delete'],
			BalancedApp.Adapter.update,
			Ember.Logger.error
		);
	}
});


test('shows webhooks', function(assert) {
	visit(Testing.SETTINGS_ROUTE)
		.checkElements({
			".webhooks tbody tr": 1
		}, assert);
});

test('can add webhooks', function(assert) {
	var stub = sinon.stub(BalancedApp.Adapter, "create");

	visit(Testing.SETTINGS_ROUTE)
		.click(".webhook-info .add")
		.fillIn("#add-callback .modal-body input[name=url]", 'http://www.example.com/something')
		.fillIn("#add-callback .modal-body select[name=callback-revision]", '1.0')
		.click('#add-callback .modal-footer button[name=modal-submit]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.equal(stub.getCall(0).args[2].revision, '1.0');
			assert.equal(stub.getCall(0).args[2].url, 'http://www.example.com/something');
		});
});

test('webhooks get created once if submit button is clicked multiple times', function(assert) {
	var stub = sinon.stub(BalancedApp.Adapter, "create");

	visit(Testing.SETTINGS_ROUTE)
		.click(".webhook-info .add")
		.fillIn("#add-callback .modal-body input[name=url]", 'http://www.example.com/something')
		.fillIn("#add-callback .modal-body select[name=callback-revision]", '1.1')
		.click('#add-callback .modal-footer button[name=modal-submit]')
		.click('#add-callback .modal-footer button[name=modal-submit]')
		.click('#add-callback .modal-footer button[name=modal-submit]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.equal(stub.getCall(0).args[2].revision, '1.1');
			assert.equal(stub.getCall(0).args[2].url, 'http://www.example.com/something');
		});
});

test('can delete webhooks', function(assert) {
	visit(Testing.SETTINGS_ROUTE)
		.click('.webhooks tbody tr:first a.delete-callback-link')
		.click('#delete-callback:visible .modal-footer button[name=modal-submit]')
		.checkElements({
			".webhooks tbody td.no-results": 1
		}, assert);
});

test('delete webhooks only submits once even if clicked multiple times', function(assert) {
	var spy = sinon.stub(BalancedApp.Adapter, "delete");

	visit(Testing.SETTINGS_ROUTE)
		.click('.webhooks tbody tr:first a.delete-callback-link')
		.click('#delete-callback .modal-footer button[name=modal-submit]')
		.click('#delete-callback .modal-footer button[name=modal-submit]')
		.click('#delete-callback .modal-footer button[name=modal-submit]')
		.click('#delete-callback .modal-footer button[name=modal-submit]')
		.then(function() {
			assert.ok(spy.calledOnce);
		});
});
