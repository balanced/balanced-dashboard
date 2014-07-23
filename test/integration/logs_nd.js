module('Logs (non-deterministic)', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDebits();
	},
	teardown: function() {

	}
});

var setLogsProperties = function() {
	Ember.run(function() {
		var controller = Balanced.__container__.lookup('controller:marketplaceLogs');
		controller.get("model").setProperties({
			limit: 2,
			startTime: null,
			endTime: null
		});
	});
};

test('has logs in table', function(assert) {
	visit(Testing.LOGS_ROUTE)
		.then(function() {
			setLogsProperties();
		})
		.click('#marketplace-nav i.icon-logs')
		.checkElements({
			'table.logs tbody tr': 2
		}, assert)
		.click('table.logs tfoot tr a')
		.checkElements({
			'table.logs tbody tr': 4,
			'table.logs tfoot td': 1
		}, assert);
});
