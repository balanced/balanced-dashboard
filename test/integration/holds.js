var holdRoute;
var hold;

module('Holds', {
	setup: function() {
		Balanced.TEST.setupMarketplace();
		var uri, user;
		Ember.run(function() {
			Balanced.Customer.create({
				name: 'Dali Wali'
			}).save().then(function(customer) {
				user = customer;
			});
			Balanced.Card.create({
				name: 'Test Card',
				number: "4111111111111111",
				expiration_month: '12',
				expiration_year: '2020',
				security_code: '123'
			}).save().then(function(card) {
				Balanced.Hold.create({
					uri: card.get('card_holds_uri'),
					appears_on_statement_as: 'Pixie Dust',
					amount: 10000,
					description: 'Cocaine'
				}).save().then(function(createdHold) {
					hold = createdHold;
					holdRoute = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID + '/holds/' + hold.get('id');
				});
			});
		});
	},
	teardown: function() {

	}
});

test('can visit page', function(assert) {
	visit(holdRoute).then(function() {
		assert.notEqual($('#content h1').text().indexOf('Hold'), -1, 'Title is not correct');
		assert.equal($(".transaction-description").text().trim(), 'Created: $100.00');
	});
});

test('can void hold', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(holdRoute)
		.click(".void-hold-button")
		.click('#void-hold .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Hold, hold.get('uri')));
			assert.ok(spy.getCall(0).args[2].is_void);
		});
});

test('can capture hold', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(holdRoute)
		.click(".capture-hold-button")
		.fillIn('#capture-hold .modal-body input[name="dollar_amount"]', '10')
		.fillIn('#capture-hold .modal-body input[name="description"]', 'Test debit')
		.click('#capture-hold .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Debit));
			assert.equal(spy.getCall(0).args[2].amount, 1000);
			assert.equal(spy.getCall(0).args[2].description, "Test debit");
			assert.equal(spy.getCall(0).args[2].hold_uri, hold.get('uri'));
		});
});

test('can edit hold', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(holdRoute)
		.click('.hold .transaction-info a.edit')
		.fillIn('.edit-transaction.in .modal-body input[name="description"]', "changing desc")
		.click('.edit-transaction.in .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Hold));
			assert.equal(spy.getCall(0).args[2].description, "changing desc");
		});
});
