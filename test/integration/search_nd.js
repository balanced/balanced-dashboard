module('Search (non-deterministic)', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDebits();
		Testing.createCustomer();
		Balanced.Auth.setProperties({
			signedIn: true,
			isGuest: false
		});
	}
});

test('search "%" returns 4 transactions total, showing 2 transactions in results, with load more', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.checkElements({
			"#search .results .transactions.filter": "Transactions (4)",
			'#search .results table.transactions tbody tr': 2,
			'#search .results table.transactions tfoot td': 1
		}, assert)
		.then(function() {
			// Manually check the transactions uri is correct
			var controller = Balanced.__container__.lookup('controller:search');
			var resultsUri = controller.get('results_uri');
			assert.ok(controller.get('results_base_uri').indexOf('/search') >= 0, 'Search Transactions URI is correct');
			assert.ok(resultsUri.indexOf('card_hold') >= 0, 'Search URI filter by type is correct');
		})
		.click('#search .results th.type ul.dropdown-menu li a:contains(Holds)')
		.then(function() {
			// Manually check the transactions uri is correct
			var controller = Balanced.__container__.lookup('controller:search');
			var resultsUri = controller.get('results_uri');
			assert.ok(controller.get('results_base_uri').indexOf('/search') >= 0, 'Search Transactions URI is correct');
			assert.ok(resultsUri.indexOf('type=card_hold') > 0, 'Search Transactions Type is correct');

			// Check if it filters
			assert.equal($('#search .results table.transactions tr td.no-results').length, 1, 'has "no results"');
		});
});

test('search "%", click customers, returns 2 customer total, showing 2 customer in results, with no load more', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.checkElements({
			"#search .results .customers.filter": "Customers (2)",
		}, assert)
		.click('#search .results .customers > a')
		.checkElements({
			'#search .results table.customers tbody tr:last td:eq(1)': 'William Henry Cavendish IIIwhc@example.org',
			'#search .results table.customers tbody tr': 2,
			'#search .results table.customers tfoot td': 0
		}, assert);
});

test('search "%" returns 4 transactions. Click load more shows 2 more and hides load more', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.then(function() {
			assert.equal($('#search .results table.transactions tfoot td').length, 1, 'has "load more"');
		})
		.assertClick('#search .results table.transactions tfoot td.load-more-results a', assert)
		.then(function() {
			assert.equal($('#search .results table.transactions tbody tr').length, 4, 'has 4 transactions');
			assert.equal($('#search .results table.transactions tfoot td').length, 0, 'does not have "load more"');
		});
});

test('search click result', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.assertClick('#search .results .customers a:first', assert)
		.assertClick('#search .results table.items tbody tr a:first', assert)
		.then(function() {
			assert.equal($('#content h1').text().trim(), 'Customer', 'transition to customer page');
			assert.equal($('#search .results:visible').length, 0, 'search result should be hidden');
		});
});
