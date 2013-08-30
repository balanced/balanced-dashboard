var refundsRoutePath = '/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/refunds/RF44kCAddvYXYs4hqUwnaRb8';

module('Refunds', {
	setup: function () {
	}, teardown: function () {
	}
});

test('can visit page', function (assert) {
    visit(refundsRoutePath).then(function() {
    	assert.notEqual($('#content h1').text().indexOf('Refund'), -1, 'Title is not correct');
		assert.equal($(".refund .transaction-description").text().trim(), 'Created: $42.00');
    });
});

test('can edit refund', function (assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(refundsRoutePath)
	.click(".refund .transaction-info a.edit")
	.fillIn('.refund .edit-transaction.in .modal-body input[name="description"]', "changing desc")
	.click('.refund .edit-transaction.in .modal-footer button[name="modal-submit"]')
	.then(function() {
		assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.Refund));
        assert.equal(spy.getCall(0).args[2].description, "changing desc");
	});
});
