module('Debits', {
	setup: function () {
		Testing.selectMarketplaceByName();

		Balanced.Adapter.asyncCallbacks = true;

		Ember.run(function () {
			var debit = Balanced.Debit.find('/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/debits/WD3TaPwBiqg2SECH1Q33QuvC');
			Balanced.Router.create().transitionTo('debits', debit);
		});
	}, teardown: function () {
	}
});

asyncTest('can visit page', function (assert) {
    expect(2);
	Testing.execWithTimeoutPromise(function() {
		assert.notEqual($('#content h1').text().indexOf('Debit'), -1, 'Title is not correct');
		assert.equal($(".debit .transaction-description").text().trim(), 'Succeeded: $42.00');
        start();
	})();
});

asyncTest('can refund debit', function (assert) {
	expect(4);

	var spy = sinon.spy(Balanced.Adapter, "create");

	Testing.execWithTimeoutPromise(function() {
        $(".refund-debit-button").click();

        $('#refund-debit .modal-body input[name="dollar_amount"]').val("10").trigger('keyup');

        $('#refund-debit .modal-footer button[name="modal-submit"]').click();

        // Click a few times to make sure we don't get multiple submissions
        $('#refund-debit .modal-footer button[name="modal-submit"]').click();
        $('#refund-debit .modal-footer button[name="modal-submit"]').click();
    })().then(Testing.execWithTimeoutPromise(function() {
        assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.Refund));
        assert.equal(spy.getCall(0).args[2].debit_uri, '/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/debits/WD3TaPwBiqg2SECH1Q33QuvC');
        assert.equal(spy.getCall(0).args[2].amount, '1000');
        start();
    }));
});

asyncTest('can edit debit', function (assert) {
	expect(3);

	var spy = sinon.spy(Balanced.Adapter, "update");

	Testing.execWithTimeoutPromise(function() {
        $(".debit .transaction-info a.edit").click();

        $('.debit .edit-transaction.in .modal-body input[name="description"]').val("changing desc").trigger('keyup');

        $('.debit .edit-transaction.in .modal-footer button[name="modal-submit"]').click();

        // Click a few times to make sure we don't get multiple submissions
        $('.debit .edit-transaction.in .modal-footer button[name="modal-submit"]').click();
        $('.debit .edit-transaction.in .modal-footer button[name="modal-submit"]').click();
    })().then(Testing.execWithTimeoutPromise(function() {
        assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.Debit));
        assert.equal(spy.getCall(0).args[2].description, "changing desc");
        start();
    }));
});

