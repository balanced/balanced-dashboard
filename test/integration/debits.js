var debitRoutePath = '/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/debits/WD3TaPwBiqg2SECH1Q33QuvC';

module('Debits', {
	setup: function () {
	}, teardown: function () {
	}
});

test('can visit page', function (assert) {
	visit(debitRoutePath).then(function() {
		assert.notEqual($('#content h1').text().indexOf('Debit'), -1, 'Title is not correct');
		assert.equal($(".debit .transaction-description").text().trim(), 'Succeeded: $42.00');
	});
});

test('can refund debit', function (assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(debitRoutePath).then(function() {
		click(".refund-debit-button");
	}).then(function() {
		$('#refund-debit .modal-body input[name="dollar_amount"]').val("10").trigger('keyup');

		return click('#refund-debit .modal-footer button[name="modal-submit"]');
	}).then(function() {
		assert.ok(spy.calledOnce);
		assert.ok(spy.calledWith(Balanced.Refund));
		assert.equal(spy.getCall(0).args[2].debit_uri, '/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/debits/WD3TaPwBiqg2SECH1Q33QuvC');
		assert.equal(spy.getCall(0).args[2].amount, '1000');
	});
});

test("can't refund failed debit", function (assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(debitRoutePath + '-FAILED').then(function() {
		assert.equal($(".refund-debit-button").length, 0);
	});
});

test('can edit debit', function (assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(debitRoutePath).then(function() {
		return click(".debit .transaction-info a.edit");
	}).then(function() {
		$('.debit .edit-transaction.in .modal-body input[name="description"]').val("changing desc").trigger('keyup');

		return click('.debit .edit-transaction.in .modal-footer button[name="modal-submit"]');
	}).then(function() {
		assert.ok(spy.calledOnce);
		assert.ok(spy.calledWith(Balanced.Debit));
		assert.equal(spy.getCall(0).args[2].description, "changing desc");
	});
});

