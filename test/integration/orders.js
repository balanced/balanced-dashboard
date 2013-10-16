var orderRoute;

module('Order Page', {
	setup: function() {
		Balanced.TEST.setupMarketplace();
		Ember.run(function() {

			Balanced.Order.create({
				uri: '/customers/' + Balanced.TEST.CUSTOMER_ID + '/orders'
			}).save().then(function(order) {
				Balanced.TEST.ORDER_ID = order.get('id');
				orderRoute = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID +
					'/orders/' + Balanced.TEST.ORDER_ID;
			});

			Balanced.Card.create({
				uri: '/cards',
				name: 'Test Card',
				number: "4111111111111111",
				expiration_month: '12',
				expiration_year: '2020',
				security_code: '123'
			}).save().then(function(card) {
				Balanced.Debit.create({
					uri: card.get('debits_uri'),
					appears_on_statement_as: 'Pixie Dust',
					amount: 10000,
					description: 'Cocaine',
					links: {
						order: '/orders/' + Balanced.TEST.ORDER_ID
					}
				}).save().then(function(debit) {
					Balanced.TEST.DEBIT_ID = debit.get('id');
				});
			});

		});
	},
	teardown: function() {}
});

test('can visit order page', function(assert) {
	visit(orderRoute).then(function() {
		assert.equal($('#content h1.page-title').text().trim(), 'Order');
		assert.equal($('.order-customer').length, 2, 'Order page has a buyer and a seller.');
	});
});
