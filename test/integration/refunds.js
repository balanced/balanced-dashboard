module('Refunds', {
	setup: function () {
		Testing.selectMarketplaceByName();

		Balanced.Adapter.asyncCallbacks = true;

		Ember.run(function () {
			var refund = Balanced.Refund.find('/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/refunds/RF44kCAddvYXYs4hqUwnaRb8');
			Balanced.Router.create().transitionTo('refunds', refund);
		});
	}, teardown: function () {
	}
});

test('can visit page', function (assert) {
	Ember.run(function() {
		assert.notEqual($('#content h1').text().indexOf('Refund'), -1, 'Title is not correct');
		assert.equal($(".refund .transaction-description").text().trim(), 'Created: $42.00');
	});
});

asyncTest('can edit refund', function (assert) {
	expect(3);

	var spy = sinon.spy(Balanced.Adapter, "update");

	Testing.execWithTimeoutPromise(function() {
        $(".refund .transaction-info a.edit").click();

        $('.refund .edit-transaction.in .modal-body input[name="description"]').val("changing desc").trigger('keyup');

        $('.refund .edit-transaction.in .modal-footer button[name="modal-submit"]').click();

        // Click a few times to make sure we don't get multiple submissions
        $('.refund .edit-transaction.in .modal-footer button[name="modal-submit"]').click();
        $('.refund .edit-transaction.in .modal-footer button[name="modal-submit"]').click();
    })().then(Testing.execWithTimeoutPromise(function() {
        assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.Refund));
        assert.equal(spy.getCall(0).args[2].description, "changing desc");
        start();
    }));
});
