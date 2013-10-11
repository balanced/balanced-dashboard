var creditRoute;

module('Credits', {
	setup: function() {
		Balanced.TEST.setupMarketplace();
		Ember.run(function() {
			Balanced.Card.create({
				name: 'Test Card',
				number: "4111111111111111",
				expiration_month: '12',
				expiration_year: '2020',
				security_code: '123'
			}).save().then(function(card) {
				Balanced.Debit.create({
					uri: card.get('debits_uri'),
					amount: 100000
				}).save();
			}).then(function() {
				return Balanced.BankAccount.create({
					name: 'Test Account',
					account_number: '1234',
					routing_number: '122242607',
					type: 'checking'
				}).save();
			}).then(function(bankAccount) {
				Balanced.TEST.BANK_ACCOUNT_ID = bankAccount.get('id');

				Balanced.Credit.create({
					uri: bankAccount.get('credits_uri'),
					amount: 100000
				}).save().then(function(credit) {
					Balanced.TEST.CREDIT_ID = credit.get('id');
					Balanced.TEST.CREDIT_URI = credit.get('uri');
					creditRoute = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID +
						'/credits/' + Balanced.TEST.CREDIT_ID;
				});
			});
		});
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	visit(creditRoute).then(function() {
		assert.notEqual($('#content h1').text().indexOf('Credit'), -1, 'Title is not correct');
		assert.equal($(".credit .transaction-description").text().trim(), 'Succeeded: $1000.00');
	});
});

test('can reverse credit', function(assert) {
	Balanced.Auth.get('user').set('admin', true);

	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(creditRoute).then(function() {
		return click(".reverse-credit-button");
	}).then(function() {
		return click('#reverse-credit .modal-footer button[name="modal-submit"]');
	}).then(function() {
		assert.ok(spy.calledOnce);
		assert.ok(spy.calledWith(Balanced.Reversal));
		assert.equal(spy.getCall(0).args[2].credit_uri, Balanced.TEST.CREDIT_URI);
		assert.equal(spy.getCall(0).args[2].amount, '100000');
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
