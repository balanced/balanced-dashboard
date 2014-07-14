module('Logs (non-deterministic)', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDebits();
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter.get
		);
	}
});

test('has logs in table', 3, function(assert) {
	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.then(function() {
			Ember.run(function() {
				Balanced.__container__.lookup('controller:marketplaceLogs').setProperties({
					minDate: null,
					maxDate: null
				});
			});
		})
		.checkElements({
			'table.logs tbody tr': 2
		}, assert)
		.click('table.logs tfoot tr a')
		.checkElements({
			'table.logs tbody tr': 4,
			'table.logs tfoot td': 1
		}, assert);
});
