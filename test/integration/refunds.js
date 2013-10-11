var refundRoute;
var refund;

module('Refunds', {
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
				}).save().then(function(debit) {
					Balanced.Refund.create({
						uri: debit.get('refunds_uri'),
						debit_uri: debit.get('uri'),
						amount: 10000
					}).save().then(function(createdRefund) {
						refund = createdRefund;
						refundRoute = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID + '/refunds/' + createdRefund.get('id');
					})
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
