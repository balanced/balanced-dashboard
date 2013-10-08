var creditRoute;

module('Credits', {
	setup: function() {
		Ember.run(function() {
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
				}).done(function(res) {
					creditRoute = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID +
						'/credits/' + res.id;
				});
			});
		});
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	visit(creditRoute).then(function() {
		assert.notEqual($('#content h1').text().indexOf('Credit'), -1, 'Title is not correct');
		assert.equal($(".credit .transaction-description").text().trim(), 'Paid: $25.00');
	});
});

test('can reverse credit', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(creditRoute).then(function() {
		return click(".reverse-credit-button");
	}).then(function() {
		return click('#reverse-credit .modal-footer button[name="modal-submit"]');
	}).then(function() {
		assert.ok(spy.calledOnce);
		assert.ok(spy.calledWith(Balanced.Reversal));
		assert.equal(spy.getCall(0).args[2].credit_uri, '/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/credits/CR5WLencnYp5YFgk43RWoXrM');
		assert.equal(spy.getCall(0).args[2].amount, '2500');
	});
});

test('admins can reverse credit regardless of marketplace settings', function(assert) {
	Balanced.Auth.get('user').set('admin', true);

	visit('/marketplaces/TEST-TEST_CREDITS/credits/1').then(function() {
		assert.equal($(".reverse-credit-button").length, 1);
	});
});

test('can edit credit', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(creditRoute)
		.click('.credit .transaction-info a.edit')
		.fillIn('.edit-transaction.in .modal-body input[name="description"]', "changing desc")
		.click('.edit-transaction.in .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Credit));
			assert.equal(spy.getCall(0).args[2].description, "changing desc");
		});
});
