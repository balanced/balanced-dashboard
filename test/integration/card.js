var cardRoute;

module('Card Page', {
	setup: function() {
		Balanced.TEST.setupMarketplace();
		Ember.run(function() {
			Balanced.Card.create({
				uri: '/customers/' + Balanced.TEST.CUSTOMER_ID + '/cards',
				number: '4444400012123434',
				name: 'Test Card',
				expiration_year: 2020,
				expiration_month: 11
			}).save().then(function(card) {
				Balanced.TEST.CARD_ID = card.get('id');
				cardRoute = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID +
					'/cards/' + Balanced.TEST.CARD_ID;
			});
		});
	},
	teardown: function() {}
});

test('can view card page', function(assert) {
	visit(cardRoute)
		.then(function() {
			assert.equal($('#content h1').text().trim(), 'Card');
			assert.equal($(".title span").text().trim(), 'Test Card (3434)');
		});
});

test('debit card', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(cardRoute)
		.then(function() {
			var controller = Balanced.__container__.lookup('controller:cards');
			var model = controller.get('model');
			model.set('customer', true);

			// wait for computed property to fire first
			Ember.run.next(function() {
				click(".main-header .buttons a.debit-button")
				.fillIn('#debit-funding-instrument .modal-body input[name="dollar_amount"]', "1000")
				.fillIn('#debit-funding-instrument .modal-body input[name="description"]', "Test debit")
				.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
				.then(function() {
					assert.ok(spy.calledOnce);
					assert.ok(spy.calledWith(Balanced.Debit, "/cards/" + Balanced.TEST.CARD_ID + "/debits", sinon.match({
						amount: 100000,
						description: "Test debit"
					})));
				});
			});
		});
});

test('debiting only submits once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(cardRoute)
		.then(function() {
			var controller = Balanced.__container__.lookup('controller:cards');
			var model = controller.get('model');
			model.set('customer', true);

			// wait for computed property to fire first
			Ember.run.next(function() {
				click(".main-header .buttons a.debit-button")
				.fillIn('#debit-funding-instrument .modal-body input[name="dollar_amount"]', "1000")
				.fillIn('#debit-funding-instrument .modal-body input[name="description"]', "Test debit")
				.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
				.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
				.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
				.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
				.then(function() {
					assert.ok(stub.calledOnce);
				});
			});
		});
});
