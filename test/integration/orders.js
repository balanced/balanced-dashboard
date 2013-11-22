module('Order Page', {
	setup: function() {
		Testing.setupMarketplace();
		Ember.run(function() {

			Balanced.Order.create({
				uri: '/customers/' + Testing.CUSTOMER_ID + '/orders'
			}).save().then(function(order) {
				Testing.ORDER_ID = order.get('id');
				Testing.ORDER_ROUTE = '/marketplaces/' + Testing.MARKETPLACE_ID +
					'/orders/' + Testing.ORDER_ID;

				return Balanced.Debit.create({
					uri: '/customers/' + Testing.CUSTOMER_ID + '/debits',
					appears_on_statement_as: 'Pixie Dust',
					amount: 10000,
					description: 'Cocaine',
					links: {
						order: '/orders/' + Testing.ORDER_ID
					}
				}).save();

			}).then(function(debit) {

				Testing.DEBIT = debit;

				return Testing._createBankAccount();

			}).then(function(bankAccount) {

				return Balanced.Credit.create({
					uri: bankAccount.get('credits_uri'),
					amount: 1000,
					links: {
						order: '/orders/' + Testing.ORDER_ID
					}
				}).save();

			}).then(function(credit) {

				Testing.CREDIT_1 = credit;

				return Balanced.BankAccount.create({
					uri: '/customers/' + Testing.CUSTOMER_ID + '/bank_accounts',
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
						order: '/orders/' + Testing.ORDER_ID
					}
				}).save();

			}).then(function(credit) {

				Testing.CREDIT_2 = credit;

				return Balanced.Customer.find('/customers/' + Testing.CUSTOMER_ID);

			}).then(function(customer) {

				Testing.CUSTOMER = customer;

			});

		});
	},
	teardown: function() {}
});

test('can visit order page', function(assert) {
	visit(Testing.ORDER_ROUTE).then(function() {
		assert.equal($('#content h1.page-title').text().trim(), 'Order', 'Page title is correct.');
		assert.equal($('.order-customer').length, 2, 'Order page has a buyer and a seller.');

		var model = Balanced.__container__.lookup('controller:orders').get('model');
		model.set('credits', Ember.A([
			Testing.CREDIT_1,
			Testing.CREDIT_2
		]));
		model.set('debits', Ember.A([
			Testing.DEBIT
		]));
		model.set('buyers', Ember.A([
			Testing.CUSTOMER
		]));
		model.set('seller', Testing.CUSTOMER);
		stop();

		Ember.run.next(function() {
			start();
			assert.equal($('.transaction-details').length, 2, 'There is a debit and a credit.');
		});
	});
});
