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
			var query = Balanced.Utils.queryStringToObject(logRequest.args[1]);
			assert.equal(logRequest.args[0], Balanced.Log);
			assert.deepEqual(query, {
				limit: "2",
				sort: "created_at,desc",
				offset: "0",
				"method[in]": "post,put,delete"
			});
		})
		.checkElements({
			'#content h1': "Logs"
		}, assert);
});

test('has logs in table', function(assert) {
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
			var query = Balanced.Utils.queryStringToObject(spy.lastCall.args[1]);
			assert.deepEqual(query, {
				endpoint: "bank_accounts",
				limit: "2",
				"method[in]": "post,put,delete",
				offset: "0",
				sort: "created_at,desc"
			});
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
			var controller = Balanced.__container__.lookup('controller:marketplaceLogs');
			controller.get("resultsLoader").setProperties({
				startTime: moment('2013-08-01T00:00:00.000Z').toDate(),
				endTime: moment('2013-08-01T23:59:59.999Z').toDate()
			});
		})
		.click('.daterangepicker:visible .buttons button.applyBtn')
		.then(function() {
			var request = spy.lastCall;
			assert.equal(spy.callCount, 6);
			assert.equal(request.args[0], Balanced.Log);

			var query = Balanced.Utils.queryStringToObject(request.args[1]);
			assert.deepEqual(query, {
				"created_at[<]": "2013-08-01T23:59:59.999Z",
				"created_at[>]": "2013-08-01T00:00:00.000Z",
				limit: "50",
				"method[in]": "post,put,delete",
				offset: "0",
				sort: "created_at,desc"
			});
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
			var query = Balanced.Utils.queryStringToObject(spy.lastCall.args[1]);
			assert.equal(spy.lastCall.args[0], Balanced.Log);
			assert.deepEqual(query, {
				limit: "2",
				sort: "created_at,desc",
				offset: "0",
				"method[in]": "post,put,delete",
				"status_rollup[in]": "3xx,4xx,5xx"
			});
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
