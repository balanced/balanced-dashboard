module('Refunds', {
	setup: function() {
		Testing.setupMarketplace();
		Ember.run(function() {
			Testing._createCard().then(function(card) {
				return Balanced.Debit.create({
					uri: card.get('debits_uri'),
					amount: 100000
				}).save();
			}).then(function(debit) {
				return Balanced.Refund.create({
					uri: debit.get('refunds_uri'),
					debit_uri: debit.get('uri'),
					amount: 10000
				}).save();
			}).then(function(refund) {
				Testing.REFUND_ROUTE = '/marketplaces/' + Testing.MARKETPLACE_ID + '/refunds/' + refund.get('id');
			});
		});
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	visit(Testing.REFUND_ROUTE).then(function() {
		assert.notEqual($('#content h1').text().indexOf('Refund'), -1, 'Title is not correct');
		assert.equal($(".refund .transaction-description").text().trim(), 'Succeeded: $100.00');
	});
});

test('can edit refund', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(Testing.REFUND_ROUTE)
		.click('.refund .transaction-info a.edit')
		.fillIn('.edit-transaction.in .modal-body input[name="description"]', "changing desc")
		.click('.edit-transaction.in .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Refund));
			assert.equal(spy.getCall(0).args[2].description, "changing desc");
		});
});
