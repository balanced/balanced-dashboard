import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Order Page', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();

		andThen(function() {
			Models.Order.create({
				uri: '/customers/' + Testing.CUSTOMER_ID + '/orders',
				description: '#123'
			}).save().then(function(order) {
				Testing.ORDER_ID = order.get('id');
				Testing.ORDER_ROUTE = '/marketplaces/' + Testing.MARKETPLACE_ID +
					'/orders/' + Testing.ORDER_ID;

				return Models.Debit.create({
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

				return Models.Credit.create({
					uri: '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/credits',
					amount: 1000,
					links: {
						order: '/orders/' + Testing.ORDER_ID
					}
				}).save();
			}).then(function(credit) {
				Testing.CREDIT_1 = credit;

				return Models.BankAccount.create({
					uri: '/customers/' + Testing.CUSTOMER_ID + '/bank_accounts',
					name: 'Test Account 2',
					account_number: '12345',
					routing_number: '122242607',
					type: 'checking'
				}).save();
			}).then(function(bankAccount) {
				Testing.BANK_ACCOUNT_ID = bankAccount.get('id');

				return Models.Credit.create({
					uri: '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/credits',
					amount: 1000,
					links: {
						order: '/orders/' + Testing.ORDER_ID
					}
				}).save();
			}).then(function(credit) {
				Testing.CREDIT_2 = credit;

				return Models.Refund.create({
					uri: '/debits/' + Testing.DEBIT.get('id') + '/refunds',
					amount: 200,
					description: 'Cocaine refund',
					links: {
						order: '/orders/' + Testing.ORDER_ID
					}
				}).save();
			}).then(function(refund) {
				Testing.REFUND = refund;

				return Models.Reversal.create({
					uri: '/credits/' + Testing.CREDIT_1.get('id') + '/reversals',
					amount: 100,
					links: {
						order: '/orders/' + Testing.ORDER_ID
					}
				}).save();
			}).then(function(reversal) {
				Testing.REVERSAL = reversal;

				return Models.Customer.find('/customers/' + Testing.CUSTOMER_ID);
			}).then(function(customer) {
				Testing.CUSTOMER = customer;
			});
		});
	},
	teardown: function() {
		Ember.run(App, 'destroy');
	}
});

var assertQueryString = function(string, expected) {
	var qsParameters = Models.Utils.queryStringToObject(string);
	_.each(expected, function(value, key) {
		deepEqual(qsParameters[key], value, "Query string parameter %@".fmt(key));
	});
};

test('can visit order page', function() {
	visit(Testing.ORDER_ROUTE)
		.checkPageType("OrderOrder escrow")
		.checkPageTitle("#123");
});

test("can visit orders page", function() {
	visit(Testing.MARKETPLACE_ROUTE)
		.click(".sidebar a:contains(Orders)")
		.checkPageTitle("Orders")
		.then(function() {
			var resultsUri = BalancedApp.__container__.lookup('controller:marketplace/orders').get("resultsLoader.resultsUri");
			deepEqual(resultsUri.split("?")[0], "/orders");

			assertQueryString(resultsUri, {
				limit: "50",
			});
		});
});
