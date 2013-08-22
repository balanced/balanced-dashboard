module('Reversals', {
	setup: function () {
		Testing.selectMarketplaceByName();

		// TODO - figure out why Travis chokes on callbacks and make these async again
		Balanced.Adapter.asyncCallbacks = false;
        Testing.asyncCallbacks = false;

		Ember.run(function () {
			var reversal = Balanced.Reversal.find('/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/credits/CR5WLencnYp5YFgk43RWoXrM/reversals/RV1k7EBixU1TP1KboTrbVu9W');
			Balanced.Router.create().transitionTo('reversals', reversal);
		});
	}, teardown: function () {
	}
});

asyncTest('can visit page', function (assert) {
    expect(2);
	Testing.execWithTimeoutPromise(function() {
		assert.notEqual($('#content h1').text().indexOf('Reversal'), -1, 'Title is not correct');
		assert.equal($(".reversal .transaction-description").text().trim(), 'Created: $25.00');
        start();
	})();
});

asyncTest('can edit reversal', function (assert) {
	expect(3);

	var spy = sinon.spy(Balanced.Adapter, "update");

	Testing.execWithTimeoutPromise(function() {
        $(".reversal .transaction-info a.edit").click();

        $('.reversal .edit-transaction.in .modal-body input[name="description"]').val("changing desc").trigger('keyup');

        $('.reversal .edit-transaction.in .modal-footer button[name="modal-submit"]').click();

        // Click a few times to make sure we don't get multiple submissions
        $('.reversal .edit-transaction.in .modal-footer button[name="modal-submit"]').click();
        $('.reversal .edit-transaction.in .modal-footer button[name="modal-submit"]').click();
    })().then(Testing.execWithTimeoutPromise(function() {
        assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.Reversal));
        assert.equal(spy.getCall(0).args[2].description, "changing desc");
        start();
    }));
});
