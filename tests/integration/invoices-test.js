import Ember from "ember";
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';
import fixturesAdapter from "../helpers/fixtures-adapter";
import sinonRestore from "../helpers/sinon-restore";

import Testing from "../helpers/testing";
import helpers from "../helpers/helpers";
import checkElements from "../helpers/check-elements";
import Models from "../helpers/models";

var INVOICES_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/account_statements';

var App, Auth, Adapter = fixturesAdapter;

module('Integration - Invoices', {
	setup: function() {
		App = startApp({
			ADAPTER: fixturesAdapter
		});
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.get,
			Adapter.update
		);
		Ember.run(App, 'destroy');
	}
});

test('can visit page', function() {
	var invoicesController = BalancedApp.__container__.lookup('controller:marketplace/invoices');
	sinon.stub(invoicesController, "send");

	visit(INVOICES_ROUTE)
		.then(function() {
			Ember.run(function() {
				invoicesController.get("model").setProperties({
					startTime: moment('2013-08-01T00:00:00.000Z').toDate(),
					endTime: moment('2013-08-01T23:59:59.999Z').toDate()
				});
			});
		})
		.visit(INVOICES_ROUTE)
		.checkElements({
			"#content h1": "Account statements",
			"table.invoices tbody tr": 19
		});
});

test('disputes invoice details page', function() {
	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/account_statements/IV7GSC6Fm4gx7UxjnmNXJ54X")
		.checkElements({
			".dispute-details-row td:eq(1)": "1",
			".dispute-details-row .total": "$113.10",
		});
});

test("transactions invoice detail page filters", function() {
	var invoiceUri = '/invoices/IVDOATjeyAPTJMJPnBR83uE';
	var spy;

	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/account_statements/IVDOATjeyAPTJMJPnBR83uE")
		.then(function() {
			spy = sinon.stub(Adapter, "get");
		})
		.click('.main-panel .search-filters-header a:contains(Debits (Cards))')
		.click('.main-panel .search-filters-header a:contains(Refunds)')
		.then(function() {
			deepEqual(spy.getCall(0).args.slice(0, 2), [Models.Transaction, invoiceUri + '/card_debits?limit=50&sort=created_at%2Cdesc']);
			deepEqual(spy.getCall(2).args.slice(0, 2), [Models.Transaction, invoiceUri + '/refunds?limit=50&sort=created_at%2Cdesc']);
		});
});

test('transactions invoice detail page', function() {
	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/account_statements/IVDOATjeyAPTJMJPnBR83uE")
		.checkElements({
			".card-debit-details-row .total": "$2.45",
			".card-debit-details-row td:eq(3)": "3.5% of txn + $0.29",
			".bank-account-debit-details-row .total": "$0.00",
			".succeeded-bank-account-credit-details-row .total": "$0.00",
			".succeeded-card-credit-details-row .total": "$0.00",
			".refund-details-row .total": "-$2.45",
		});
});

test('change invoice funding source', function() {
	var invoiceUri = '/invoices/IVDOATjeyAPTJMJPnBR83uE';
	var stub = sinon.stub(Adapter, "update");
	stub.callsArg(3);

	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/account_statements/IVDOATjeyAPTJMJPnBR83uE")
		.then(function() {
			var marketplace = BalancedApp.__container__.lookup("controller:marketplace").get("model");
			Ember.run(function() {
				var customer = Models.Customer.create();
				marketplace.set("owner_customer", customer);
				customer.set("bank_accounts", [
					Ember.Object.create({
						can_debit: true,
						uri: "/bank_accounts/xxxxxxxxxx",
						description: "Super cool"
					})
				]);
			});
		})
		.click(".change-funding-source")
		.fillIn('#change-funding-source form select[name=source]', '123')
		.click('#change-funding-source form button[name=modal-submit]')
		.then(function() {
			var args = stub.firstCall.args;
			equal(stub.callCount, 1);
			deepEqual(args.slice(0, 2), [Models.Invoice, invoiceUri]);
			equal(args[2].source_uri, "/bank_accounts/xxxxxxxxxx");
		});
});
