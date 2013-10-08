var reversalsRoute;

module('Reversals', {
	setup: function() {
		Ember.run(function() {
			Balanced.Debit.create({
				uri: '/v1/customers/' + Balanced.TEST.CUSTOMER_ID + '/debits',
				appears_on_statement_as: 'Pixie Dust',
				amount: 100000,
				description: 'Cocaine'
			}).save();
			Balanced.BankAccount.create({
				name: 'Test Account',
				account_number: '1234',
				routing_number: '122242607',
				type: 'checking'
			}).save().then(function(bankAccount) {
				Balanced.TEST.BANK_ACCOUNT_ID = bankAccount.get('id');
				Balanced.NET.ajax({
					url: ENV.BALANCED.API + '/v1/bank_accounts/' + Balanced.TEST.BANK_ACCOUNT_ID + '/credits',
					type: 'post',
					data: {
						amount: 100000
					}
				}).then(function(res) {
					Balanced.TEST.CREDIT_ID = res.id;
					return Balanced.NET.ajax({
						url: ENV.BALANCED.API + '/v1/marketplaces/' + Balanced.TEST.MARKETPLACE_ID +
							'/credits/' + Balanced.TEST.CREDIT_ID + '/reversals',
						type: 'post'
					});
				}).done(function(res) {
					Balanced.TEST.REVERSAL_ID = res.id;
					reversalsRoute = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID +
						'/reversals/' + Balanced.TEST.REVERSAL_ID;
				});
			});
		});
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	visit(reversalsRoute).then(function() {
		assert.notEqual($('#content h1').text().indexOf('Reversal'), -1, 'Title is not correct');
		assert.equal($(".reversal .transaction-description").text().trim(), 'Succeeded: $1000.00');
	});
});

test('can edit reversal', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(reversalsRoute)
		.click('.reversal .transaction-info a.edit')
		.fillIn('.edit-transaction.in .modal-body input[name="description"]', "changing desc")
		.click('.edit-transaction.in .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Reversal));
			assert.equal(spy.getCall(0).args[2].description, "changing desc");
		});
});
