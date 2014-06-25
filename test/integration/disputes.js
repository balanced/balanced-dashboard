module('Disputes', {
	setup: function() {
		Testing.useFixtureData();
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	var DISPUTES_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/disputes';

	visit(DISPUTES_ROUTE)
		.then(function() {
			var disputesController = Balanced.__container__.lookup('controller:marketplace_disputes');
			console.log(DISPUTES_ROUTE);
			console.log(disputesController);
			assert.equal(disputesController.get('results_base_uri'), '/disputes', 'Disputes URI is correct');
			assert.ok(disputesController.get('results_uri').indexOf('sort=initiated_at') > 0, 'Disputes sort is correct');
		})
		.checkElements({
			"#content h1": "Disputes",
			"#disputes table tbody tr": 1,
			'table.disputes tbody tr:eq(0) td.date.initiated': 1,
			'table.disputes tbody tr:eq(0) td.date.respond-by': 1,
			'table.disputes tbody tr:eq(0) td.status': 'Pending',
			'table.disputes tbody tr:eq(0) td.account': 1,
			'table.disputes tbody tr:eq(0) td.funding-instrument': 1,
			'table.disputes tbody tr:eq(0) td.amount': '$12.00',
			'table.disputes tfoot td:eq(0)': 1
		}, assert);
});

// test('can visit page', function(assert) {
// 	var DISPUTE_ROUTE = DISPUTES_ROUTE + '/DT2xOc7zAdgufK4XsCIW5QgD';
// 	var disputePage = {
// 		'#content h1': 'Dispute',
// 		'#dispute > .main-header .title': 1, // 'Brand New Electric Guitar Rosewood Fingerboard Sunset Red',
// 		'#dispute .customer-info .main-header .title': 1, // 'William Henry Cavendish III (whc@example.org)',
// 		'#dispute .transaction-details .dispute .tt-title': 'Pending: $100.00',
// 		'#dispute .transaction-details .debit .tt-title': 1, // 'Succeeded: $13.30',
// 		'#dispute .evidence-portal-info': 1
// 	};

// 	visit(Testing.DISPUTE_ROUTE)
// 		.checkElements(disputePage, assert)
// 		.click('#dispute .evidence-portal-info a')
// 		.then(function() {
// 			assert.ok($('.modal-header h2'), 'Attach docs');
// 		});
// });
