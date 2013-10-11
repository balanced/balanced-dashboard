var reversalsRoute;
var createdReversal;

module('Reversals', {
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

				return Balanced.Credit.create({
					uri: bankAccount.get('credits_uri'),
					amount: 100000
				}).save();
			}).then(function(credit) {
				Balanced.Reversal.create({
					uri: credit.get('reversals_uri'),
					credit_uri: credit.get('uri'),
					amount: 100000
				}).save().then(function(createdReversal) {
					reversal = createdReversal;
					reversalsRoute = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID + '/reversals/' + reversal.get('id');
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
