var debitRoute;

module('Debits', {
	setup: function() {
		Ember.run(function() {
			Balanced.Debit.create({
				uri: '/v1/customers/' + Balanced.TEST.CUSTOMER_ID + '/debits',
				appears_on_statement_as: 'Pixie Dust',
				amount: 10000,
				description: 'Cocaine'
			}).save().then(function(debit) {
				Balanced.TEST.DEBIT_ID = debit.get('id');
				debitRoute = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID +
					'/debits/' + Balanced.TEST.DEBIT_ID;
			});
		});
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	visit(debitRoute).then(function() {
		assert.notEqual($('#content h1').text().indexOf('Debit'), -1, 'Title is not correct');
		assert.equal($(".debit .transaction-description").text().trim(), 'Succeeded: $100.00');
	});
});

test('can refund debit', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(debitRoute)
		.click(".refund-debit-button")
		.fillIn('#refund-debit .modal-body input[name="dollar_amount"]', "10")
		.click('#refund-debit .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Refund));
			assert.equal(spy.getCall(0).args[2].debit_uri, '/v1/marketplaces/' + Balanced.TEST.MARKETPLACE_ID + '/debits/' + Balanced.TEST.DEBIT_ID);
			assert.equal(spy.getCall(0).args[2].amount, '1000');
		});
});

test("can't refund failed debit", function(assert) {
	visit(debitRoute + '-FAILED').then(function() {
		assert.equal($(".refund-debit-button").length, 0);
	});
});

test('can edit debit', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(debitRoute)
		.click('.debit .transaction-info a.edit')
		.fillIn('.edit-transaction.in .modal-body input[name="description"]', "changing desc")
		.click('.edit-transaction.in .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Debit));
			assert.equal(spy.getCall(0).args[2].description, "changing desc");
		});
});
