var logsRoutePath = '/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/logs';

module('Logs', {
	setup: function () {
	}, teardown: function () {
	}
});

test('can visit page', function (assert) {
	var spy = sinon.spy(Balanced.Adapter, 'get');

  visit(logsRoutePath)
	.click('#marketplace-nav .logs a')
  .then(function() {
    var $title = $('#content h1');
    var logRequest = spy.getCall(spy.callCount - 1);
    assert.equal(logRequest.args[0], Balanced.Log);
    assert.equal(logRequest.args[1], '/v1/logs?limit=20&method%5Bin%5D=post%2Cput%2Cdelete&offset=0&q=&sort=created_at%2Cdesc');
    assert.notEqual($title.text().indexOf('Logs'), -1, 'Title is not correct');
  });
});

test('has logs in table', function (assert) {
  visit(logsRoutePath)
	.click('#marketplace-nav .logs a')
  .then(function() {
    assert.equal($('table.logs tbody tr').length, 20, 'has 20 logs');
    assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');
  })
	.click('table.logs tfoot tr a')
  .then(function() {
    assert.equal($('table.logs tbody tr').length, 40, 'has 40 logs');
    assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');
  });
});

test('filter logs by endpoint bank accounts', function (assert) {
  var spy = sinon.spy(Balanced.Adapter, 'get');

  visit(logsRoutePath)
  .click('#marketplace-nav .logs a')
  .then(function() {
    assert.equal($('table.logs tbody tr').length, 20, 'has 20 logs');
    assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');
  })
	.click('.results li.filter-endpoints ul li.bank_accounts a')
  .then(function() {
    assert.ok(spy.calledWith(Balanced.Log, '/v1/logs?limit=20&method%5Bin%5D=post%2Cput%2Cdelete&offset=0&q=&sort=created_at%2Cdesc'));
    assert.equal($('table.logs tbody tr').length, 8, 'has 8 logs');
  });
});

test('filter logs by request failed only', function (assert) {
	var spy = sinon.spy(Balanced.Adapter, 'get');

  visit(logsRoutePath)
	.click('#marketplace-nav .logs a')
  .then(function() {
    assert.equal($('table.logs tbody tr').length, 20, 'has 20 logs');
    assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');
  })
	.click('.results .filter-status-rollup label.succeeded input[type="checkbox"]')
  .then(function() {
    assert.ok(spy.calledWith(Balanced.Log, 
      '/v1/logs?limit=20&method%5Bin%5D=post%2Cput%2Cdelete&offset=0&q=&sort=created_at%2Cdesc&status_rollup%5Bin%5D=3xx%2C4xx%2C5xx'));

    assert.equal($('table.logs tbody tr').length, 20, 'has 20 logs');
    assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');

    // check the first row is the log we expect
    assert.equal(
      $('table.logs tbody tr td a').first().attr('href'),
      '/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/logs/OHM9d1fc57cf94111e291bb026ba7d31e6f');
  });
});

test('view a particular log entry', function (assert) {
  visit(logsRoutePath)
	.click('#marketplace-nav .logs a')
	.click($('table.logs tbody tr a').first())
  .then(function() {
    assert.equal($('h1.page-title').text(), 'POST /v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications', 'h1 title is correct');
    assert.equal($('#log-request-id').text(), 'OHMa2a01fecf94111e2ab70026ba7cac9da', 'Log request id matches');
  });
});
