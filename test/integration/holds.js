var holdRoutePath = '/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/holds/HL5oPyl3e5QKjtMdbsnLhYpy';

module('Holds', {
	setup: function () {

	}, teardown: function () {

	}
});

test('can visit page', function (assert) {
    visit(holdRoutePath).then(function() {
        assert.notEqual($('#content h1').text().indexOf('Hold'), -1, 'Title is not correct');
        assert.equal($(".transaction-description").text().trim(), 'Created: $42.00');
    });
});

test('can void hold', function (assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

    visit(holdRoutePath)
    .click(".void-hold-button")
    .click('#void-hold .modal-footer button[name="modal-submit"]')
    .then(function() {
        assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.Hold, '/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/holds/HL5oPyl3e5QKjtMdbsnLhYpy'));
        assert.ok(spy.getCall(0).args[2].is_void);
    });
});

test('can capture hold', function (assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

    visit(holdRoutePath)
    .click(".capture-hold-button")
    .fillIn('#capture-hold .modal-body input[name="dollar_amount"]', '10')
    .fillIn('#capture-hold .modal-body input[name="description"]', 'Test debit')
    .click('#capture-hold .modal-footer button[name="modal-submit"]')
    .then(function() {
        assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.Debit));
        assert.equal(spy.getCall(0).args[2].amount, 1000);
        assert.equal(spy.getCall(0).args[2].description, "Test debit");
        assert.equal(spy.getCall(0).args[2].hold_uri, '/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/holds/HL5oPyl3e5QKjtMdbsnLhYpy');
    });
});

test('can edit hold', function (assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

    visit(holdRoutePath)
    .click(".transaction-info a.edit")
    .fillIn('.edit-transaction.in .modal-body input[name="description"]', 'changing desc')
    .click('.edit-transaction.in .modal-footer button[name="modal-submit"]')
    .then(function() {
        assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.Hold));
        assert.equal(spy.getCall(0).args[2].description, "changing desc");
    });
});

