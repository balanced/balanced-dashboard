import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Pay Seller', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.create
		);
		Ember.run(App, 'destroy');
	}
});

test('can pay a seller', function() {
	var stub = sinon.stub(Adapter, "create");

	visit(Testing.MARKETPLACES_ROUTE)
		.click(".page-navigation a:contains(Credit a bank account)")
		.fillForm('#pay-seller', {
			'name': 'TEST',
			'routing_number': '123123123',
			'account_number': '123123123',
			'account_type': 'checking',
			'dollar_amount': '98',
			'appears_on_statement_as': 'Transaction',
			'description': "Cool"
		})
		.click('#pay-seller .modal-footer button:contains(Credit)')
		.then(function() {
			ok(stub.calledOnce, "Called Once");
			deepEqual(stub.firstCall.args.slice(0, 3), [Models.Credit, "/credits", {
				amount: "9800",
				appears_on_statement_as: "Transaction",
				description: "Cool",
				destination: {
					account_number: "123123123",
					name: "TEST",
					routing_number: "123123123",
					account_type: "checking"
				}
			}]);
		});
});

test('pay a seller only submits once despite multiple button clicks', function() {
	var stub = sinon.stub(Adapter, "create");

	visit(Testing.MARKETPLACES_ROUTE)
		.click(".page-navigation a:contains(Credit a bank account)")
		.fillForm('#pay-seller', {
			'name': 'TEST',
			'routing_number': '123123123',
			'account_number': '123123123',
			'account_type': 'checking',
			'dollar_amount': '98',
			'appears_on_statement_as': 'Transaction'
		}, {
			clickMultiple: '.modal-footer button:contains(Credit)'
		})
		.then(function() {
			ok(stub.calledOnce);
		});
});
