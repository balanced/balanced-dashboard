module('Logs', {
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

var setLogsProperties = function() {
	Ember.run(function() {
		var controller = Balanced.__container__.lookup('controller:marketplaceLogs');
		controller.get("resultsLoader").setProperties({
			limit: 2,
			startTime: null,
			endTime: null
		});
	});
};

test('can visit page', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, 'get');

	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.then(function() {
			setLogsProperties();
		})
		.then(function() {
			var logRequest = spy.getCall(spy.callCount - 1);
			assert.equal(logRequest.args[0], Balanced.Log);
			assert.equal(logRequest.args[1], "/logs?limit=2&sort=created_at%2Cdesc&offset=0&method%5Bin%5D=post%2Cput%2Cdelete");
		})
		.checkElements({
			'#content h1': "Logs"
		}, assert);
});

test('has logs in table', 3, function(assert) {
	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.then(function() {
			setLogsProperties();
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
			assert.ok(spy.calledWith(Balanced.Log, "/logs?limit=2&sort=created_at%2Cdesc&offset=0&method%5Bin%5D=post%2Cput%2Cdelete&endpoint=bank_accounts"));
		})
		.checkElements({
			'table.logs tbody tr': 1
		}, assert);

});

test('filter logs by datetime range', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, 'get');

	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.click('#content .datetime-picker')
		.then(function() {
			assert.equal($('.daterangepicker:visible').length, 1, 'Date Picker visible');
			$('.daterangepicker:visible input[name="daterangepicker_end"]').val('8/1/2013').trigger('change');
		})
		.then(function() {
			assert.equal($('.daterangepicker:visible').length, 1, 'Date Picker is still visible');
			$('.daterangepicker:visible input[name="daterangepicker_start"]').val('8/1/2013').trigger('change');
			$('.daterangepicker:visible input[name="daterangepicker_end"]').val('8/1/2013').trigger('change');
		})
		.click('.daterangepicker:visible .buttons button.applyBtn')
		.then(function() {
			var expected_uri = "/logs?limit=50&sort=created_at%2Cdesc&offset=0&method%5Bin%5D=post%2Cput%2Cdelete&created_at%5B%3E%5D=2013-08-01T07%3A00%3A00.000Z&created_at%5B%3C%5D=2013-08-02T06%3A59%3A59.999Z";

			var request = spy.getCall(spy.callCount - 1);
			assert.ok(spy.callCount, 2);
			assert.equal(request.args[0], Balanced.Log);
			assert.equal(request.args[1], expected_uri);
		});
});


test('filter logs by request failed only', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, 'get');

	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.then(function() {
			setLogsProperties();
		})
		.click('#logs .results .status-filter a:contains(Failed)')
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Log, "/logs?limit=2&sort=created_at%2Cdesc&offset=0&method%5Bin%5D=post%2Cput%2Cdelete&status_rollup%5Bin%5D=3xx%2C4xx%2C5xx"));
		})
		.checkElements({
			'table.logs tbody tr': 1,
			'table.logs tfoot td': "",
			'table.logs tbody tr td': 'No results'
		}, assert);
});

test('view a particular log entry', function(assert) {
	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.click('table.logs tbody tr:first-of-type a')
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
