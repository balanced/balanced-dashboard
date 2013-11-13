/*
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
			});
		});
	},
	teardown: function() {

	}
});

test('can visit page', function(assert) {
	visit(Testing.HOLD_ROUTE).then(function() {
		assert.notEqual($('#content h1').text().indexOf('Hold'), -1, 'Title is not correct');
		assert.equal($(".transaction-description").text().trim(), 'Created: $100.00');
	});
});

test('can void hold', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(Testing.HOLD_ROUTE)
		.click(".void-hold-button")
		.click('#void-hold .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Hold, hold.get('uri')));
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
			assert.equal(spy.getCall(0).args[2].hold_uri, hold.get('uri'));
		});
});

test('can edit hold', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(Testing.HOLD_ROUTE)
		.click('.hold .transaction-info a.edit')
		.fillIn('.edit-transaction.in .modal-body input[name="description"]', "changing desc")
		.click('.edit-transaction.in .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Hold));
			assert.equal(spy.getCall(0).args[2].description, "changing desc");
		});
});
*/
