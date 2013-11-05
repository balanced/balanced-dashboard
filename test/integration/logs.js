var logsRoute;

module('Logs', {
	setup: function() {
		Balanced.TEST.setupMarketplace();
		var i = 3;
		while(i > 0) {
			Ember.run(function() {
				Balanced.Debit.create({
					uri: '/customers/' + Balanced.TEST.CUSTOMER_ID + '/debits',
					appears_on_statement_as: 'Pixie Dust',
					amount: 10000,
					description: 'Cocaine'
				}).save();
			});
			i--;
		}
		Ember.run(function() {
			Balanced.Debit.create({
				uri: '/customers/' + Balanced.TEST.CUSTOMER_ID + '/fail',
				appears_on_statement_as: 'Pixie Dust',
				amount: 10000,
				description: 'Cocaine'
			}).save();
		});
		logsRoute = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID + '/logs';

		// add some delay, because the API takes some time to add things to logs
		var stop = window.stop;
		stop();
		setTimeout(start, 1000);
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, 'get');

	visit(logsRoute)
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
	visit(logsRoute)
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

	visit(logsRoute)
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

	visit(logsRoute)
		.click('#marketplace-nav .logs a')
		.then(function() {
			assert.equal($('table.logs tbody tr').length, 2, 'has 2 logs');
			assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');
		})
		.click('.results .filter-status-rollup label.succeeded input[type="checkbox"]')
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Log,
				'/logs?limit=2&method%5Bin%5D=post%2Cput%2Cdelete&offset=0&q=&sort=created_at%2Cdesc&status_rollup%5Bin%5D=3xx%2C4xx%2C5xx'));

			assert.equal($('table.logs tbody tr').length, 1, 'has 1 log');
			assert.equal($('table.logs tfoot td').length, 0, 'no "load more"');

			// check the first row is the log we expect
			assert.ok($('table.logs tbody tr td a').first().attr('href').match(/\/logs\//));
		});
});

test('view a particular log entry', function(assert) {
	visit(logsRoute)
		.click('#marketplace-nav .logs a')
		.click('table.logs tbody tr:first-of-type a')
		.then(function() {
			assert.equal($('h1.page-title').text(), 'POST /customers/' + Balanced.TEST.CUSTOMER_ID + '/fail', 'h1 title is correct');
			assert.equal($('#log-request-id').text().length, 35, 'Log request id valid');
		});
});
