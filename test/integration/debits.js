module('Debits', {
	setup: function() {
		Testing.setupMarketplace();
		Ember.run(function() {
			Testing._createCard().then(function(card) {
				return Balanced.Debit.create({
					uri: card.get('debits_uri'),
					appears_on_statement_as: 'Pixie Dust',
					amount: 100000,
					description: 'Cocaine'
				}).save();
			}).then(function(debit) {
				Testing.DEBIT_ID = debit.get('id');
				Testing.DEBIT_URI = debit.get('uri');
				Testing.DEBIT_ROUTE = '/marketplaces/' + Testing.MARKETPLACE_ID + '/debits/' + Testing.DEBIT_ID;
			});
		});
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	visit(Testing.DEBIT_ROUTE).then(function() {
		assert.notEqual($('#content h1').text().indexOf('Debit'), -1, 'Title is not correct');
		assert.equal($(".debit .transaction-description").text().trim(), 'Succeeded: $1,000.00');
	});
});

test('can refund debit', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(Testing.DEBIT_ROUTE)
		.click(".refund-debit-button")
		.fillIn('#refund-debit .modal-body input[name="dollar_amount"]', "10")
		.click('#refund-debit .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Refund));
			assert.equal(spy.getCall(0).args[2].debit_uri, Testing.DEBIT_URI);
			assert.equal(spy.getCall(0).args[2].amount, '1000');
		});
});

test('can edit debit', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(Testing.DEBIT_ROUTE)
		.click('.debit .transaction-info a.edit')
		.fillIn('.edit-transaction.in .modal-body input[name="description"]', "changing desc")
		.click('.edit-transaction.in .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Debit));
			assert.equal(spy.getCall(0).args[2].description, "changing desc");
		});
});

test('failed debit shows failure information', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(Testing.DEBIT_ROUTE).then(function() {
		var model = Balanced.__container__.lookup('controller:debits');
		model.set('status', 'failed');
		model.set('failure_reason', 'Foobar');
		stop();
		Ember.run.next(function() {
			start();
			assert.equal($('.value.failed').text().trim(), 'Foobar');
		});
	});
});
