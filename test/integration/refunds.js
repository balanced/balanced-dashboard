var refundRoute;

module('Refunds', {
	setup: function() {
		Balanced.TEST.setupMarketplace();
		Ember.run(function() {
			Balanced.Debit.create({
				uri: '/v1/customers/' + Balanced.TEST.CUSTOMER_ID + '/debits',
				appears_on_statement_as: 'Pixie Dust',
				amount: 10000,
				description: 'Cocaine'
			}).save().then(function(debit) {
				Balanced.TEST.DEBIT_ID = debit.get('id');
				Balanced.NET.ajax({
					url: ENV.BALANCED.API + '/v1/marketplaces/' + Balanced.TEST.MARKETPLACE_ID +
						'/debits/' + Balanced.TEST.DEBIT_ID + '/refunds',
					type: 'post'
				}).done(function(res) {
					refundRoute = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID +
						'/refunds/' + res.id;
				});
			});
		});
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	visit(refundRoute).then(function() {
		assert.notEqual($('#content h1').text().indexOf('Refund'), -1, 'Title is not correct');
		assert.equal($(".refund .transaction-description").text().trim(), 'Succeeded: $100.00');
	});
});

test('can edit refund', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(refundRoute)
		.click('.refund .transaction-info a.edit')
		.fillIn('.edit-transaction.in .modal-body input[name="description"]', "changing desc")
		.click('.edit-transaction.in .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Refund));
			assert.equal(spy.getCall(0).args[2].description, "changing desc");
		});
});
