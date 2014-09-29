import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module("Integration - Customer Page: Delete", {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.createBankAccount();
		Testing.createCard();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter["delete"]
		);
		Ember.run(App, 'destroy');
	}
});














test('can delete bank account', function() {
	var spy = sinon.stub(Adapter, "delete");
	var ModelClass = BalancedApp.__container__.lookupFactory("model:bank-account");

	visit(Testing.CUSTOMER_ROUTE)
		.then(function() {
			var m = BalancedApp.__container__.lookup("controller:customer").get("fundingInstrumentsResultsLoader");
			var load = function(response) {
				var f = ModelClass.create();
				f.populateFromJsonResponse(response);
				return f;
			};

			Ember.run(function() {
				var results = Ember.A();
				m.set("results", results);
				results.pushObject(load({
					"bank_accounts": [{
						"routing_number": "122242607",
						"bank_name": "WELLS FARGO BANK",
						"account_type": "checking",
						"name": "Test Account",
						"can_credit": true,
						"href": "/bank_accounts/BAxxxxxxxxxxxxxxxx",
						"account_number": "1234",
						"can_debit": true,
						"id": "BAxxxxxxxxxxxxxxxx"
					}]
				}));
			});
		})
		.click("table.items.funding-instruments tr.type-bank-account .funding-instrument-delete:last")
		.click('#delete-funding-instrument button[name=modal-submit]')
		.then(function() {
			var args = spy.firstCall.args;
			ok(spy.calledOnce, "Adapter.deleted calledOnce");
			deepEqual(args.slice(0, 2), [ModelClass, "/bank_accounts/BAxxxxxxxxxxxxxxxx"]);
		});
});

test('can delete cards', function() {
	var spy = sinon.stub(Adapter, "delete").returns(Ember.RSVP.resolve());
	var ModelClass = BalancedApp.__container__.lookupFactory("model:card");

	visit(Testing.CUSTOMER_ROUTE)
		.then(function() {
			var m = BalancedApp.__container__.lookup("controller:customer").get("fundingInstrumentsResultsLoader");
			var load = function(response) {
				var f = ModelClass.create();
				f.populateFromJsonResponse(response);
				return f;
			};

			Ember.run(function() {
				var results = Ember.A();
				m.set("results", results);
				results.pushObject(load({
					cards: [{
						"number": "xxxxxxxxxxxx5556",
						"id": "CCxxxxxxxxxxxxxxxxxxx",
						"type": "debit",
						"brand": "Visa",
						"can_debit": true,
						"can_credit": true,
						"href": "/cards/CCxxxxxxxxxxxxxxxxxxx",
					}]
				}));
			});
		})
		.click("table.items.funding-instruments tr.type-card .funding-instrument-delete:last")
		.click('#delete-funding-instrument button[name=modal-submit]')
		.then(function() {
			var args = spy.firstCall.args;
			ok(spy.calledOnce, "Adapter.deleted calledOnce");
			deepEqual(args.slice(0, 2), [ModelClass, "/cards/CCxxxxxxxxxxxxxxxxxxx"]);
		});
});
