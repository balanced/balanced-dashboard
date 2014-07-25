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
		// Testing.pause(100);
	}
});

var assertQueryString = function(string, expected, assert) {
	var qsParameters = Balanced.Utils.queryStringToObject(string);
	_.each(expected, function(value, key) {
		assert.deepEqual(qsParameters[key], value, "Query string parameter %@".fmt(key));
	});
};

test('can visit order page', function(assert) {
	visit(Testing.ORDER_ROUTE)
		.checkPageTitle("Order #123", assert);
});

test("can visit orders page", function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.click(".sidebar a:contains(Orders)")
		.checkPageTitle("Orders", assert)
		.then(function() {
			var resultsUri = Balanced.__container__.lookup('controller:marketplace_orders').get("resultsLoader.resultsUri");
			assert.deepEqual(resultsUri.split("?")[0], "/orders");

			assertQueryString(resultsUri, {
				limit: "50",
			}, assert);
		});
});
