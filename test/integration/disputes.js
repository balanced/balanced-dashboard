module('Disputes', {
	setup: function() {
		Testing.useFixtureData();
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	var DISPUTES_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/disputes';
	var disputesController = Balanced.__container__.lookup('controller:marketplace_disputes');
	disputesController.reopen({
		minDate: moment('2013-08-01T00:00:00.000Z').toDate(),
		maxDate: moment('2013-08-01T23:59:59.999Z').toDate()
	});
	visit(DISPUTES_ROUTE)
		.then(function() {
			assert.equal(disputesController.get('results_base_uri'), '/disputes', 'Disputes URI is correct');
			assert.ok(disputesController.get('results_uri').indexOf('sort=initiated_at') > 0, 'Disputes sort is correct');
		})
		.checkElements({
			"#content h1": "Disputes",
			"#disputes table tbody tr": 2,
			'table.disputes tbody tr:eq(0) td.date.initiated': 1,
			'table.disputes tbody tr:eq(0) td.date.respond-by': 1,
			'table.disputes tbody tr:eq(0) td.status': 'pending',
			'table.disputes tbody tr:eq(0) td.account': 1,
			'table.disputes tbody tr:eq(0) td.funding-instrument': 1,
			'table.disputes tbody tr:eq(0) td.amount': '$2.00',
		}, assert);
});
