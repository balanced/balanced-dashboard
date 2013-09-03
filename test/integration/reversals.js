var reversalsRoutePath = '/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/reversals/RV1k7EBixU1TP1KboTrbVu9W';

module('Reversals', {
	setup: function () {
	}, teardown: function () {
	}
});

test('can visit page', function (assert) {
	visit(reversalsRoutePath).then(function() {
		assert.notEqual($('#content h1').text().indexOf('Reversal'), -1, 'Title is not correct');
		assert.equal($(".reversal .transaction-description").text().trim(), 'Created: $25.00');
	});
});

test('can edit reversal', function (assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(reversalsRoutePath)
	.click(".reversal .transaction-info a.edit")
	.fillIn('.reversal .edit-transaction.in .modal-body input[name="description"]', "changing desc")
	.click('.reversal .edit-transaction.in .modal-footer button[name="modal-submit"]')
	.then(function() {
		assert.ok(spy.calledOnce);
		assert.ok(spy.calledWith(Balanced.Reversal));
		assert.equal(spy.getCall(0).args[2].description, "changing desc");
	});
});
