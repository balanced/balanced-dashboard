module('Holds', {
	setup: function () {
		Testing.selectMarketplaceByName();

		Balanced.Adapter.asyncCallbacks = true;

		Ember.run(function () {
			var hold = Balanced.Hold.find('/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/holds/HL5oPyl3e5QKjtMdbsnLhYpy');
			Balanced.Router.create().transitionTo('holds', hold);
		});
	}, teardown: function () {
	}
});

test('can visit page', function (assert) {
	Ember.run(function() {
		assert.notEqual($('#content h1').text().indexOf('Hold'), -1, 'Title is not correct');
		assert.equal($(".transaction-description").text().trim(), 'Created: $42.00');
	});
});

asyncTest('can void hold', function (assert) {
	expect(3);

	var spy = sinon.spy(Balanced.Adapter, "update");

	Testing.execWithTimeoutPromise(function() {
        $(".void-hold-button").click();
        $('#void-hold .modal-footer button[name="modal-submit"]').click();
    })().then(Testing.execWithTimeoutPromise(function() {
        assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.Hold, '/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/holds/HL5oPyl3e5QKjtMdbsnLhYpy'));
        assert.ok(spy.getCall(0).args[2].is_void);
        start();
    }));
});

asyncTest('can capture hold', function (assert) {
	expect(5);

	var spy = sinon.spy(Balanced.Adapter, "create");

	Testing.execWithTimeoutPromise(function() {
        $(".capture-hold-button").click();

        $('#capture-hold .modal-body input[name="dollar_amount"]').val("10").trigger('keyup');
        $('#capture-hold .modal-body input[name="description"]').val("Test debit").trigger('keyup');

        $('#capture-hold .modal-footer button[name="modal-submit"]').click();
    })().then(Testing.execWithTimeoutPromise(function() {
        assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.Debit));
        assert.equal(spy.getCall(0).args[2].amount, 1000);
        assert.equal(spy.getCall(0).args[2].description, "Test debit");
        assert.equal(spy.getCall(0).args[2].hold_uri, '/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/holds/HL5oPyl3e5QKjtMdbsnLhYpy');
        start();
    }));
});

asyncTest('can edit hold', function (assert) {
	expect(3);

	var spy = sinon.spy(Balanced.Adapter, "update");

	Testing.execWithTimeoutPromise(function() {
        $(".transaction-info a.edit").click();

        $('.edit-transaction.in .modal-body input[name="description"]').val("changing desc").trigger('keyup');

        $('.edit-transaction.in .modal-footer button[name="modal-submit"]').click();
    })().then(Testing.execWithTimeoutPromise(function() {
        assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.Hold));
        assert.equal(spy.getCall(0).args[2].description, "changing desc");
        start();
    }));
});

