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
		Balanced.__container__.lookup('controller:marketplaceLogs').setProperties({
			minDate: null,
			maxDate: null
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
			var $title = $('#content h1');
			var logRequest = spy.getCall(spy.callCount - 1);
			assert.equal(logRequest.args[0], Balanced.Log);
			assert.equal(logRequest.args[1], '/logs?limit=2&method%5Bin%5D=post%2Cput%2Cdelete&offset=0&q=&sort=created_at%2Cdesc');
			assert.notEqual($title.text().indexOf('Logs'), -1, 'Title is correct');
		});
});

test('has logs in table', 3, function(assert) {
	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.then(function() {
			setLogsProperties();
		})
		.then(function() {
			assert.equal($('table.logs tbody tr').length, 2, 'has 2 logs');
		})
		.click('table.logs tfoot tr a')
		.then(function() {
			assert.equal($('table.logs tbody tr').length, 4, 'has 4 logs');
			assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');
		});
});

test('filter logs by endpoint bank accounts', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, 'get');

	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.then(function() {
			setLogsProperties();
		})
		.then(function() {
			assert.equal($('table.logs tbody tr').length, 2, 'has 2 logs');
		})
		.click('.results .status-filter a.bank_accounts')
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Log, '/logs?limit=2&method%5Bin%5D=post%2Cput%2Cdelete&offset=0&q=&sort=created_at%2Cdesc'));
			assert.equal($('table.logs tbody tr').length, 1, 'has 1 log');
		});
});

test('filter logs by datetime range', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, 'get');

	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.then(function() {
			assert.equal($('table.logs tbody tr').length, 2, 'has 2 logs');
		})
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
			var begin = moment('8/1/2013').startOf('day');
			var begin_iso = encodeURIComponent(begin.toISOString());
			var end = moment('8/1/2013').endOf('day');
			var end_iso = encodeURIComponent(end.toISOString());

			var expected_uri = '/logs?' +
				'created_at%5B%3C%5D=' + end_iso + '&' +
				'created_at%5B%3E%5D=' + begin_iso + '&' +
				'limit=2&method%5Bin%5D=post%2Cput%2Cdelete&offset=0&q=&sort=created_at%2Cdesc';

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
		.then(function() {
			assert.equal($('table.logs tbody tr').length, 2, 'has 2 logs');
		})
		.click('.results .status-filter a:contains(Failed)')
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Log,
				'/logs?limit=2&method%5Bin%5D=post%2Cput%2Cdelete&offset=0&q=&sort=created_at%2Cdesc&status_rollup%5Bin%5D=3xx%2C4xx%2C5xx'));

			assert.equal($('table.logs tbody tr').length, 1, 'has no failures');
			assert.equal($('table.logs tfoot td').length, 0, 'no "load more"');

			// check the first row is the log we expect
			assert.equal($('table.logs tbody tr td').first().text().trim(), 'No results');
		});
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
