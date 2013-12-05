module('Reversals', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createReversal();
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	visit(Testing.REVERSAL_ROUTE).then(function() {
		assert.notEqual($('#content h1').text().indexOf('Reversal'), -1, 'Title is not correct');
		assert.equal($(".reversal .transaction-description").text().trim(), 'Succeeded: $100.00');
	});
});

test('can edit reversal', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(Testing.REVERSAL_ROUTE)
		.click('.reversal .transaction-info a.edit')
		.fillIn('.edit-transaction.in .modal-body input[name="description"]', "changing desc")
		.click('.edit-transaction.in .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Reversal));
			assert.equal(spy.getCall(0).args[2].description, "changing desc");
		});
});
