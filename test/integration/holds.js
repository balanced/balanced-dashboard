module('Holds', {
	setup: function() {
		Testing.setupMarketplace();
		Ember.run(function() {
			Testing._createCard().then(function(card) {
				return Balanced.Hold.create({
					uri: card.get('card_holds_uri'),
					appears_on_statement_as: 'Pixie Dust',
					amount: 10000,
					description: 'Cocaine'
				}).save();
			}).then(function(hold) {
				Testing.HOLD_ROUTE = '/marketplaces/' + Testing.MARKETPLACE_ID + '/holds/' + hold.get('id');
				Testing.HOLD_URI = hold.get("uri");
			});
		});
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter.update,
			Balanced.Adapter.create
		);
	}
});

test('can visit page', function(assert) {
	visit(Testing.HOLD_ROUTE)
		.checkPageTitle("Hold $100.00", assert);
});

test('can void hold', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(Testing.HOLD_ROUTE)
		.click(".void-hold-button")
		.click('#void-hold .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.deepEqual(spy.firstCall.args[0], Balanced.Hold);
			assert.deepEqual(spy.firstCall.args[1], Testing.HOLD_URI);
			assert.ok(spy.getCall(0).args[2].is_void);
		});
});

test('can capture hold', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(Testing.HOLD_ROUTE)
		.click(".capture-hold-button")
		.fillIn('#capture-hold .modal-body input[name="dollar_amount"]', '10')
		.fillIn('#capture-hold .modal-body input[name="description"]', 'Test debit')
		.click('#capture-hold .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Debit));
			assert.equal(spy.getCall(0).args[2].amount, 1000);
			assert.equal(spy.getCall(0).args[2].description, "Test debit");
			assert.equal(spy.getCall(0).args[2].hold_uri, Testing.HOLD_URI);
		});
});
