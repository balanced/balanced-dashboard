module('Reversals', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createReversal();
	},
	teardown: function() {
		Testing.restoreMethods(
			BalancedApp.Adapter.update
		);
	}
});

test('can visit page', function(assert) {
	visit(Testing.REVERSAL_ROUTE)
		.checkPageType("Reversal", assert)
		.checkPageTitle("$100.00", assert);
});

test('can edit reversal', function(assert) {
	var spy = sinon.spy(BalancedApp.Adapter, "update");

	visit(Testing.REVERSAL_ROUTE)
		.click('.key-value-display .edit-model-link')
		.fillForm("#edit-transaction", {
			description: "changing desc"
		})
		.click('#edit-transaction .modal-footer button[name=modal-submit]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Reversal));
			assert.equal(spy.getCall(0).args[2].description, "changing desc");
		});
});

test('renders metadata correctly', function(assert) {
	var metaData = {
		'key': 'value',
		'other-keey': 'other-vaalue'
	};

	visit(Testing.REVERSAL_ROUTE)
		.then(function() {
			var controller = Balanced.__container__.lookup('controller:reversals');
			Ember.run(function() {
				controller.set('model.meta', metaData);
			});
		})
		.checkElements({
			".dl-horizontal dt:contains(key)": 1,
			".dl-horizontal dd:contains(value)": 1,

			".dl-horizontal dt:contains(other-keey)": 1,
			".dl-horizontal dd:contains(other-vaalue)": 1,
		}, assert);
});
