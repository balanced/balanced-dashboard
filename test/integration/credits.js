module('Credits', {
	setup: function () {
		Testing.selectMarketplaceByName();

		Balanced.Adapter.asyncCallbacks = true;

		Ember.run(function () {
			var credit = Balanced.Credit.find('/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC60brEmASyL0jGa6Zmyj7u7/credits/CR5WLencnYp5YFgk43RWoXrM');
			Balanced.Router.create().transitionTo('credits', credit);
		});
	}, teardown: function () {
	}
});

test('can visit page', function (assert) {
	Ember.run(function() {
		assert.notEqual($('#content h1').text().indexOf('Credit'), -1, 'Title is not correct');
		assert.equal($(".credit .transaction-description").text().trim(), 'Paid: $25.00');
	});
});

asyncTest('can reverse credit', function (assert) {
	expect(4);

	var spy = sinon.spy(Balanced.Adapter, "create");

	Testing.execWithTimeoutPromise(function() {
        $(".reverse-credit-button").click();

        $('#reverse-credit .modal-footer button[name="modal-submit"]').click();
    })().then(Testing.execWithTimeoutPromise(function() {
        assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.Reversal));
        assert.equal(spy.getCall(0).args[2].credit_uri, '/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC60brEmASyL0jGa6Zmyj7u7/credits/CR5WLencnYp5YFgk43RWoXrM');
        assert.equal(spy.getCall(0).args[2].amount, '2500');
        start();
    }));
});

asyncTest('can edit credit', function (assert) {
	expect(3);

	var spy = sinon.spy(Balanced.Adapter, "update");

	Testing.execWithTimeoutPromise(function() {
        $(".credit .transaction-info a.edit").click();

        $('.credit .edit-transaction.in .modal-body input[name="description"]').val("changing desc").trigger('keyup');

        $('.credit .edit-transaction.in .modal-footer button[name="modal-submit"]').click();
    })().then(Testing.execWithTimeoutPromise(function() {
        assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.Credit));
        assert.equal(spy.getCall(0).args[2].description, "changing desc");
        start();
    }));
});

