import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Customer Page: Credit', {
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

test('can credit to a debit card', function() {
	var spy = sinon.stub(Adapter, "create");

	visit(Testing.CUSTOMER_ROUTE)
		.then(function() {
			var m = BalancedApp.__container__.lookup("controller:customer").get("model");

			Ember.run(function() {
				var cards = loadCards([{
						"number": "xxxxxxxxxxxx5556",
						"id": "CCxxxxxxxxxxxxxxxxxxx",
						"type": "debit",
						"brand": "Visa",
						"can_debit": true,
						"can_credit": true,
						"href": "/cards/CCxxxxxxxxxxxxxxxxxxx",
						"credits_uri": "/cards/CCxxxxxxxxxxxxxxxxxxx/credits"
					}, {
						"number": "xxxxxxxxxxxx6666",
						"id": "CCxxxxxxxxxxxxxxxxxxx",
						"type": "credit",
						"brand": "Visa",
						"can_debit": true,
						"can_credit": false,
						"href": "/cards/CCxxxxxxxxxxxxxxxxxxx",
						"credits_uri": "/cards/CCxxxxxxxxxxxxxxxxxxx/credits"
				}]);

				var bankAccounts = loadBankAccounts([{
					"routing_number": "121212120",
					"bank_name": "Wells Fargo Bank",
					"account_type": "checking",
					"name": "carlos",
					"can_credit": true,
					"href": "/bank_accounts/BAxxxxxxxxxxxxxxxxxxxxxxx",
					"meta": {},
					"account_number": "xxx5556",
					"address": {
						"city": null,
						"line2": null,
						"line1": null,
						"state": null,
						"postal_code": null,
						"country_code": null
					},
					"can_debit": false,
					"id": "BAxxxxxxxxxxxxxxxxxxxxxxx"
				}]);

				m.set("cards", cards);
				m.set("bank_accounts", bankAccounts);
			});
		})
		.click(".page-navigation a:contains(Credit)")
		.checkElements({
			"#credit-customer form select[name=destination] option:contains(Checking account: 5556 Wells Fargo Bank)": 1,
			"#credit-customer form select[name=destination] option:contains(Debit card: 5556 Visa)": 1
		})
		.then(function() {
			var fundingInstrument = $("#credit-customer form select[name=destination] option:contains(Debit card: 5556 Visa)").val();
			$("#credit-customer form select[name=destination]").val(fundingInstrument).change();
		})
		.fillForm('#credit-customer', {
			dollar_amount: '1',
			appears_on_statement_as: "DEBIT",
			description: 'Test credit to a debit card'
		}, {
			click: '.modal-footer button[name=modal-submit]'
		})
		.then(function() {
			var card = BalancedApp.__container__.lookup("controller:customer").get("model.creditable_cards").objectAt(0);
			ok(spy.calledOnce, "Create was called once");
			equal(spy.firstCall.args[0], Models.lookupFactory("credit"));
			equal(spy.firstCall.args[1], '/cards/CCxxxxxxxxxxxxxxxxxxx/credits');

			deepEqual(spy.firstCall.args[2].amount, '100');
			deepEqual(spy.firstCall.args[2].description, "Test credit to a debit card");
		});
});

test('when crediting customer triggers an error, the error is displayed to the user', function() {
	visit(Testing.CUSTOMER_ROUTE)
		.click(".page-navigation a:contains(Credit)")
		.fillForm('#credit-customer', {
			dollar_amount: '10',
			description: 'Test credit'
		}, {
			click: '.modal-footer button[name=modal-submit]'
		})
		.checkElements({
			"#credit-customer .alert-error:contains(can't be blank)": 1
		});
});

test("can't credit customer multiple times using the same modal", function() {
	var stub = sinon.stub(Adapter, "create");

	visit(Testing.CUSTOMER_ROUTE)
		.click(".page-navigation a:contains(Credit)")
		.fillForm('#credit-customer', {
			dollar_amount: '1000',
			appears_on_statement_as: "SODA",
			description: 'Test credit'
		})
		.click('#credit-customer .modal-footer button[name=modal-submit]')
		.click('#credit-customer .modal-footer button[name=modal-submit]')
		.click('#credit-customer .modal-footer button[name=modal-submit]')
		.click('#credit-customer .modal-footer button[name=modal-submit]')
		.then(function() {
			deepEqual(stub.callCount, 1, "Create is created only once");
		});
});

function loadCards(response) {
	return response.map(function(response) {
		var card = BalancedApp.__container__.lookupFactory("model:card").create();
		card.populateFromJsonResponse({
			cards: [response]
		});
		return card;
	});
}

function loadBankAccounts(response) {
	return response.map(function(response) {
		var bankAccount = BalancedApp.__container__.lookupFactory("model:bankAccount").create();
		bankAccount.populateFromJsonResponse({
			bank_accounts: [response]
		});
		return bankAccount;
	});
}
