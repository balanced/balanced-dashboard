module('Logs', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDebits();

		// add some delay, because the API takes some time to add things to logs
		var stop = window.stop;
		stop();

		var count = 0;
		var checkAndStart = function() {
			var logs;

			Ember.run(function() {
				logs = Balanced.Log.findAll();
			});

			if (logs && logs.toArray().length) {
				return start();
			} else if (count < 300) {
				count++;
				return setTimeout(checkAndStart, 1000);
			} else {
				throw new Error('Logs not working');
			}
		};

		setTimeout(checkAndStart, 1000);
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, 'get');

	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav .logs a')
		.then(function() {
			var $title = $('#content h1');
			var logRequest = spy.getCall(spy.callCount - 1);
			assert.equal(logRequest.args[0], Balanced.Log);
			assert.equal(logRequest.args[1], '/logs?limit=2&method%5Bin%5D=post%2Cput%2Cdelete&offset=0&q=&sort=created_at%2Cdesc');
			assert.notEqual($title.text().indexOf('Logs'), -1, 'Title is correct');
		});
});

test('has logs in table', function(assert) {
	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav .logs a')
		.then(function() {
			assert.equal($('table.logs tbody tr').length, 2, 'has 2 logs');
			assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');
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
		.click('#marketplace-nav .logs a')
		.then(function() {
			assert.equal($('table.logs tbody tr').length, 2, 'has 2 logs');
			assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');
		})
		.click('.results li.filter-endpoints ul li.bank_accounts a')
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Log, '/logs?limit=2&method%5Bin%5D=post%2Cput%2Cdelete&offset=0&q=&sort=created_at%2Cdesc'));
			assert.equal($('table.logs tbody tr').length, 1, 'has 1 log');
		});
});

test('filter logs by request failed only', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, 'get');

	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav .logs a')
		.then(function() {
			assert.equal($('table.logs tbody tr').length, 2, 'has 2 logs');
			assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');
		})
		.click('.results .filter-status-rollup label.succeeded input[type="checkbox"]')
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
		.click('#marketplace-nav .logs a')
		.click('table.logs tbody tr:first-of-type a')
		.then(function() {
			assert.equal($('h1.page-title').text(), 'POST /customers/' + Testing.CUSTOMER_ID + '/debits', 'h1 title is correct');
			assert.equal($('#log-request-id').text().length, 35, 'Log request id valid');
		});
});
