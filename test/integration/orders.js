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

				return Balanced.Debit.create({
					uri: '/customers/' + Balanced.TEST.CUSTOMER_ID + '/debits',
					appears_on_statement_as: 'Pixie Dust',
					amount: 10000,
					description: 'Cocaine',
					links: {
						order: '/orders/' + Balanced.TEST.ORDER_ID
					}
				}).save();

			}).then(function(debit) {

				Balanced.TEST.DEBIT = debit;

				return Balanced.BankAccount.create({
					uri: '/customers/' + Balanced.TEST.CUSTOMER_ID + '/bank_accounts',
					name: 'Test Account',
					account_number: '1234',
					routing_number: '122242607',
					type: 'checking'
				}).save();

			}).then(function(bankAccount) {

				return Balanced.Credit.create({
					uri: bankAccount.get('credits_uri'),
					amount: 1000,
					links: {
						order: '/orders/' + Balanced.TEST.ORDER_ID
					}
				}).save();

			}).then(function(credit) {

				Balanced.TEST.CREDIT_1 = credit;

				return Balanced.BankAccount.create({
					uri: '/customers/' + Balanced.TEST.CUSTOMER_ID + '/bank_accounts',
					name: 'Test Account 2',
					account_number: '12345',
					routing_number: '122242607',
					type: 'checking'
				}).save();

			}).then(function(bankAccount) {

				return Balanced.Credit.create({
					uri: bankAccount.get('credits_uri'),
					amount: 1000,
					links: {
						order: '/orders/' + Balanced.TEST.ORDER_ID
					}
				}).save();

			}).then(function(credit) {

				Balanced.TEST.CREDIT_2 = credit;

				return Balanced.Customer.find('/customers/' + Balanced.TEST.CUSTOMER_ID);

			}).then(function(customer) {

				Balanced.TEST.CUSTOMER = customer;

			});

		});
	},
	teardown: function() {}
});

test('can visit order page', function(assert) {
	visit(orderRoute).then(function() {
		assert.equal($('#content h1.page-title').text().trim(), 'Order', 'Page title is correct.');
		assert.equal($('.order-customer').length, 2, 'Order page has a buyer and a seller.');

		var model = Balanced.__container__.lookup('controller:orders').get('model');
		model.set('credits', Ember.A([
			Balanced.TEST.CREDIT_1,
			Balanced.TEST.CREDIT_2
		]));
		model.set('debits', Ember.A([
			Balanced.TEST.DEBIT
		]));
		model.set('buyers', Ember.A([
			Balanced.TEST.CUSTOMER
		]));
		model.set('seller', Balanced.TEST.CUSTOMER);

		Ember.run.next(function() {
			assert.equal($('.transaction-details').length, 2, 'There is a debit and a credit.');
		});
	});
});
