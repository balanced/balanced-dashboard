import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Search (non-deterministic)', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.createDebits();
		Testing.createCustomer();
		Auth.setProperties({
			signedIn: true,
			isGuest: false
		});
	},
	teardown: function() {
		Ember.run(App, 'destroy');
	}
});

test('search "%" returns 4 transactions total, showing 2 transactions in results, with load more', function() {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.checkElements({
			"#search .results .transactions.filter": "Transactions (4)",
			'#search .results table.transactions tbody tr': 2,
			'#search .results table.transactions tfoot td': 1
		})
		.then(function() {
			// Manually check the transactions uri is correct
			var controller = BalancedApp.__container__.lookup('controller:search');
			var resultsUri = controller.get('results_uri');
			ok(controller.get('results_base_uri').indexOf('/search') >= 0, 'Search Transactions URI is correct');
			ok(resultsUri.indexOf('card_hold') >= 0, 'Search URI filter by type is correct');
		})
		.click('#search .results th.type ul.dropdown-menu li a:contains(Holds)')
		.then(function() {
			// Manually check the transactions uri is correct
			var controller = BalancedApp.__container__.lookup('controller:search');
			var resultsUri = controller.get('results_uri');
			ok(controller.get('results_base_uri').indexOf('/search') >= 0, 'Search Transactions URI is correct');
			ok(resultsUri.indexOf('type=card_hold') > 0, 'Search Transactions Type is correct');

			// Check if it filters
			equal($('#search .results table.transactions tr td.no-results').length, 1, 'has "no results"');
		});
});

test('search "%", click customers, returns 2 customer total, showing 2 customer in results, with no load more', function() {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.checkElements({
			"#search .results .customers.filter": "Customers (2)",
		})
		.click('#search .results .customers > a')
		.checkElements({
			'#search .results table.customers tbody tr:last td:eq(1)': 'William Henry Cavendish IIIwhc@example.org',
			'#search .results table.customers tbody tr': 2,
			'#search .results table.customers tfoot td': 0
		});
});

test('search "%" returns 4 transactions. Click load more shows 2 more and hides load more', function() {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.then(function() {
			equal($('#search .results table.transactions tfoot td').length, 1, 'has "load more"');
		})
		.click('#search .results table.transactions tfoot tr.load-more-results a')
		.then(function() {
			equal($('#search .results table.transactions tbody tr').length, 4, 'has 4 transactions');
			equal($('#search .results table.transactions tfoot td').length, 0, 'does not have "load more"');
		});
});

test('search click result', function() {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.click('#search .results .customers a:first')
		.click('#search .results table.items tbody tr a:first')
		.then(function() {
			equal($('#content h1').text().trim(), 'Customer', 'transition to customer page');
			equal($('#search .results:visible').length, 0, 'search result should be hidden');
		});
});
