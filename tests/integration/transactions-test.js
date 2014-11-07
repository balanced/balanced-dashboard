import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";
import Utils from "balanced-dashboard/lib/utils";

var App, Adapter,
	ADD_FUNDS_SELECTOR = "#marketplace-escrow-menu a:contains(Add funds)",
	WITHDRAW_FUNDS_SELECTOR = "#marketplace-escrow-menu a:contains(Withdraw funds)";

module('Integration - Transactions', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.createDebits();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.create
		);
		Ember.run(App, 'destroy');
	}
});

var setupMarketplaceController = function(bankAccounts) {
	Ember.run(function() {
		var model = BalancedApp.__container__.lookup('controller:marketplace').get('model');
		model.set('owner_customer', Ember.Object.create({
			debits_uri: '/customers/' + Testing.CUSTOMER_ID + '/debits',
			credits_uri: '/customers/' + Testing.CUSTOMER_ID + '/credits',
			bank_accounts: bankAccounts,
			debitable_bank_accounts: bankAccounts
		}));
	});
};
var assertQueryString = function(string, expected) {
	var qsParameters = Utils.queryStringToObject(string);
	_.each(expected, function(value, key) {
		deepEqual(qsParameters[key], value, "Query string parameter %@".fmt(key));
	});
};

var getResultsUri = function() {
	var controller = BalancedApp.__container__.lookup("controller:marketplace/transactions");
	return controller.get("resultsLoader.resultsUri");
};

test('can visit page', function() {
	visit(Testing.TRANSACTIONS_ROUTE)
		.click(".nav-pills a:contains(Transactions)")
		.checkPageTitle("Payments")
		.checkElements({
			'.payments-navbar a:contains(Export)': 1
		})
		.then(function() {
			var resultsUri = getResultsUri();
			deepEqual(resultsUri.split("?")[0], '/transactions', 'Transactions URI is correct');
			assertQueryString(resultsUri, {
				limit: "50",
				sort: "created_at,desc"
			});
		});
});

test('add funds', function() {
	var spy = sinon.spy(Adapter, "create");
	var bankAccounts = Models.BankAccount.findAll();

	visit(Testing.TRANSACTIONS_ROUTE)
		.then(function() {
			setupMarketplaceController(bankAccounts);
		})
		.click(ADD_FUNDS_SELECTOR)
		.checkElements({
			"#add-funds:visible": 1,
			'#add-funds select option': 1,
			'#add-funds label:contains(characters max)': 'Appears on statement as (14 characters max)',
			'#add-funds input[name=appears_on_statement_as][maxlength=14]': 1
		})
		.fillForm("#add-funds form", {
			"dollar_amount": "55.55",
			"appears_on_statement_as": "BALANCED TEST",
			"description": 'Adding lots of money yo'
		})
		.click("#add-funds [name=modal-submit]")
		.then(function() {
			var fundingInstrumentUri = bankAccounts.objectAt(0).get("uri");
			var args = spy.firstCall.args;
			ok(spy.calledOnce);
			equal(args[0], Models.lookupFactory("debit"));
			deepEqual(args[1], fundingInstrumentUri + "/debits");
			matchesProperties(args[2], {
				"source_uri": fundingInstrumentUri,
				"amount": "5555",
				"appears_on_statement_as": "BALANCED TEST",
				"description": 'Adding lots of money yo'
			});
		});
});

test('add funds only adds once despite multiple clicks', function() {
	var stub = sinon.stub(Adapter, "create");
	var bankAccounts = Models.BankAccount.findAll();

	visit(Testing.TRANSACTIONS_ROUTE)
		.then(function() {
			setupMarketplaceController(bankAccounts);
		})
		.click(ADD_FUNDS_SELECTOR)
		.fillForm("#add-funds", {
			dollar_amount: "55.55",
			appears_on_statement_as: "BALANCED TEST",
			description: 'Adding lots of money yo'
		})
		.clickMultiple('#add-funds .modal-footer button[name=modal-submit]', 4)
		.then(function() {
			ok(stub.calledOnce);
		});
});

test('withdraw funds', function() {
	var spy = sinon.spy(Adapter, "create");
	var bankAccounts = Models.BankAccount.findAll();

	visit(Testing.TRANSACTIONS_ROUTE)
		.then(function() {
			setupMarketplaceController(bankAccounts);
		})
		.click(WITHDRAW_FUNDS_SELECTOR)
		.then(function() {
			equal(
				$('input[name=appears_on_statement_as]:visible').attr('maxlength'),
				'14'
			);
		})
		.checkElements({
			'#withdraw-funds:visible': 1,
			'#withdraw-funds select option': 1,
			'#withdraw-funds label.control-label:contains(characters max)': 'Appears on statement as (14 characters max)'
		})
		.fillForm("#withdraw-funds form", {
			"dollar_amount": "55.55",
			"appears_on_statement_as": "BALANCED TEST",
			"description": 'Withdrawing some monies'
		})
		.click('#withdraw-funds .modal-footer button[name=modal-submit]')
		.then(function() {
			var args = spy.firstCall.args;
			ok(spy.calledOnce);

			deepEqual(args.slice(0, 2), [Models.lookupFactory("credit"), bankAccounts.objectAt(0).get("uri") + "/credits"]);
			matchesProperties(args[2], {
				amount: "5555",
				appears_on_statement_as: "BALANCED TEST",
				description: "Withdrawing some monies",
				destination_uri: bankAccounts.objectAt(0).get("uri")
			});
		});
});

test('withdraw funds only withdraws once despite multiple clicks', function() {
	var stub = sinon.stub(Adapter, "create");
	var bankAccounts = Models.BankAccount.findAll();

	visit(Testing.TRANSACTIONS_ROUTE)
		.then(function() {
			setupMarketplaceController(bankAccounts);
		})
		.click(WITHDRAW_FUNDS_SELECTOR)
		.fillForm('#withdraw-funds', {
			dollar_amount: "55.55",
			appears_on_statement_as: "Cool test"
		})
		.clickMultiple('#withdraw-funds .modal-footer button[name=modal-submit]', 4)
		.then(function() {
			ok(stub.calledOnce);
		});
});

test('download activity', function() {
	var stub;

	visit(Testing.TRANSACTIONS_ROUTE)
		.then(function() {
			var controller = BalancedApp.__container__.lookup("controller:marketplace/transactions");
			var loader = controller.get("resultsLoader");
			Ember.run(function() {
				loader.setProperties({
					startTime: moment('2013-08-01T00:00:00.000Z').toDate(),
					endTime: moment('2013-08-01T00:00:00.000Z').toDate()
				});
			});
			stub = sinon.stub(loader, "postCsvExport");
			stub.returns(Ember.RSVP.resolve());
		})
		.click(".payments-navbar a:contains(Export)")
		.fillForm("#download-csv form", {
			emailAddress: "test@example.com"
		})
		.click("#download-csv [name=modal-submit]")
		.then(function() {
			ok(stub.calledOnce);
			equal(stub.firstCall.args[0], "test@example.com");
		})
		.checkElements({
			"#header .notification-center-message:last": "We're processing your request. We will email you once the exported data is ready to view."
		});
});

test('transactions date sort has different states', function() {
	var objectPath = ".results th.date .sortable";
	var states = [];
	var count = 0;
	var testAmount = 5;

	visit(Testing.TRANSACTIONS_ROUTE)
		.then(function() {
			ok($(objectPath).is(".descending"), "Search defaults to descending");
		})
		.click(objectPath)
		.then(function() {
			ok($(objectPath).is(".ascending"), "Search is set to ascending");
		});
});

test('Filter Activity transactions table by type & status', function() {
	visit(Testing.TRANSACTIONS_ROUTE)
		.click('#content .results table.transactions th.type .type-filter li a:contains(Holds)')
		.then(function() {
			var resultsUri = getResultsUri();
			deepEqual(resultsUri.split("?")[0], '/transactions', 'Activity Transactions URI is correct');
			assertQueryString(resultsUri, {
				type: "hold",
				'status[in]': 'failed,succeeded,pending',
				limit: "50",
				sort: "created_at,desc"
			});
		})
		.click('#content table.transactions th.type a:contains(All)')
		.click("#content table.transactions th.status a:contains(Succeeded)")
		.then(function() {
			assertQueryString(getResultsUri(), {
				status: "succeeded",
				limit: "50",
				sort: "created_at,desc"
			});
		});
});
