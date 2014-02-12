module('Disputes', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDispute();
		// Testing.setupFixtures();
		// Testing.fixtureLogin();
	},
	teardown: function() {}
});

test('exist on the activity page', function(assert) {
	var activityDisputesPage = {
		'table.disputes tbody tr:eq(0) td.date': 1,
		'table.disputes tbody tr:eq(0) td.type': 'Pending',
		'table.disputes tbody tr:eq(0) td.account': 1,
		'table.disputes tbody tr:eq(0) td.funding-instrument': 1,
		'table.disputes tbody tr:eq(0) td.amount': '-$100.00'
	};

	visit(Testing.MARKETPLACE_ROUTE + '/activity/disputes')
		.then(function() {
			assert.ok($('table.disputes tbody tr').length >= 1, 'Correct Rows');
		})
		.checkElements(activityDisputesPage, assert);
});

test('can visit page', function(assert) {
	var disputePage = {
		'#content h1': 'Dispute',
		'#dispute > .main-header .title': 1, // 'Brand New Electric Guitar Rosewood Fingerboard Sunset Red',
		'#dispute .customer-info .main-header .title': 1, // 'William Henry Cavendish III (whc@example.org)',
		'#dispute .transaction-details .dispute .transaction-type-subheader .title': 'Pending: -$100.00',
		'#dispute .transaction-details .debit .transaction-type-subheader .title': 1 // 'Succeeded: $13.30'
	};

	visit(Testing.DISPUTE_URI)
		.checkElements(disputePage, assert);
});
