module('Order Page', {
	setup: function() {
		Testing.setupMarketplace();
		Ember.run(function() {
			Balanced.Order.create({
				uri: '/customers/' + Testing.CUSTOMER_ID + '/orders',
				description: '#123'
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
				Testing.BANK_ACCOUNT_ID = bankAccount.get('id');

				return Balanced.Credit.create({
					uri: '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/credits',
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
				Testing.BANK_ACCOUNT_ID = bankAccount.get('id');

				return Balanced.Credit.create({
					uri: '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/credits',
					amount: 1000,
					links: {
						order: '/orders/' + Testing.ORDER_ID
					}
				}).save();
			}).then(function(credit) {
				Testing.CREDIT_2 = credit;

				return Balanced.Refund.create({
					uri: '/debits/' + Testing.DEBIT.get('id') + '/refunds',
					amount: 200,
					description: 'Cocaine refund',
					links: {
						order: '/orders/' + Testing.ORDER_ID
					}
				}).save();
			}).then(function(refund) {
				Testing.REFUND = refund;

				return Balanced.Reversal.create({
					uri: '/credits/' + Testing.CREDIT_1.get('id') + '/reversals',
					amount: 100,
					links: {
						order: '/orders/' + Testing.ORDER_ID
					}
				}).save();
			}).then(function(reversal) {
				Testing.REVERSAL = reversal;

				return Balanced.Customer.find('/customers/' + Testing.CUSTOMER_ID);
			}).then(function(customer) {
				Testing.CUSTOMER = customer;
			});
		});

		// Pause for 100ms to allow API to catch up
		Testing.pause(100);
	},
	teardown: function() {}
});

test('can visit order page', function(assert) {
	var elements = {
		'#content h1.page-title': 'Order',
		'.order-header .title .nav3d': '#123',
		'.order-summary .row.debits .quantity': '1',
		'.order-summary .row.reversals .quantity': '1',
		'.order-summary .row.refunds .quantity': '1',
		'.order-summary .row.debits .total': '$100.00',
		'.order-summary .row.reversals .total': '$1.00',
		'.order-summary .row.refunds .total': '$2.00',
		'.order-total h1': '$79.00',
		'.order-customer': 2,
		'.transaction-details': 2,
		'.transaction-details > .ember-view > .refund': 1,
		'.transaction-details > .ember-view > .debit': 1,
		'.transaction-details > .ember-view > .credit': 2,
		'.transaction-details > .ember-view > .reversal': 1,
		'.transaction-details > div': 5,
		'.order-customer:first .order-customer-sub-header .refunded': 'Refunded: $2.00',
		'.order-customer:first .order-customer-sub-header .debited': 'Debited: $100.00',
		'.order-customer:last .order-customer-sub-header .reversed': 'Reversed: $1.00',
		'.order-customer:last .order-customer-sub-header .credited': 'Credited: $20.00'
	};

	visit(Testing.ORDER_ROUTE)
		.checkElements(elements, assert);
});
