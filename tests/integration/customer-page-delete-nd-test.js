import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module("Integration - Customer Page: Delete (Non deterministic)", {
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
	var spy = sinon.spy(Adapter, "delete");
	var initialLength, href;

	visit(Testing.CUSTOMER_ROUTE)
		.then(function() {
			var elements = $('.results .funding-instruments tr.type-bank-account .funding-instrument-delete');
			initialLength = elements.length;
			href = elements.last().attr("data-item-href");
		})
		.click("table.items.funding-instruments tr.type-bank-account .funding-instrument-delete:last")
		.click('#delete-funding-instrument button[name=modal-submit]')
		.then(function() {
			var args = spy.firstCall.args;

			equal($(".results .funding-instruments tr.type-bank-account").length, initialLength - 1);
			ok(spy.calledOnce, "Adapter.deleted calledOnce");
			deepEqual(args.slice(0, 2), [Models.BankAccount, href]);
		});
});

test('can delete cards', function() {
	var spy = sinon.spy(Adapter, "delete");
	var initialLength, href;

	visit(Testing.CUSTOMER_ROUTE)
		.then(function() {
			var elements = $('.results .funding-instruments tr.type-card .funding-instrument-delete');
			initialLength = elements.length;
			href = elements.last().attr("data-item-href");
		})
		.click("table.items.funding-instruments tr.type-bank-account .funding-instrument-delete:last")
		.click('#delete-funding-instrument button[name=modal-submit]')
		.then(function() {
			var args = spy.firstCall.args;

			equal($(".results .funding-instruments tr.type-card").length, initialLength - 1);
			ok(spy.calledOnce, "Adapter.deleted calledOnce");
			deepEqual(args.slice(0, 2), [Models.Card, href]);
		});
});
