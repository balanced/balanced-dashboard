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

test('filter logs by endpoint bank accounts', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, 'get');

	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.then(function() {
			setLogsProperties();
		})
		.checkElements({
			'table.logs tbody tr': 2
		}, assert)
		.click('.results .endpoint-filter a:contains(Bank accounts)')
		.then(function() {
			var query = Balanced.Utils.queryStringToObject(spy.lastCall.args[1]);
			assert.deepEqual(query, {
				endpoint: "bank_accounts",
				limit: "2",
				"method[in]": "post,put,delete",
				sort: "created_at,desc"
			});
		})
		.checkElements({
			'table.logs tbody tr': 1
		}, assert);

});

test('view a particular log entry', function(assert) {
	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.click('table.logs tbody tr:last-of-type a')
		.then(function() {
			assert.equal($('h1.page-title').text(), 'POST /customers/' + Testing.CUSTOMER_ID + '/debits', 'h1 title is correct');
			assert.equal($('dd[data-property="request-id"]').text().length, 35, 'Log request id valid');

			// Check request/response bodies
			assert.ok($('.request-info .prettyprint').text().length > 3, 'Has Request Body');
			assert.ok($('.response-info .prettyprint').text().length > 3, 'Has Response Body');
			assert.ok($('.request-info .prettyprint').children().length > 3, 'Request Body Is Highlighted');
			assert.ok($('.response-info .prettyprint').children().length > 3, 'Response Body Is Highlighted');
		});
});
