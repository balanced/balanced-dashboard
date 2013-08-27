module('Logs', {
    setup: function () {
        Testing.selectMarketplaceByName();

    }, teardown: function () {

    }
});

test('can visit page', function (assert) {
    var spy = sinon.spy(Balanced.Adapter, 'get');
    // click the logs link
    $('#marketplace-nav .logs a').click();

    //  check the page title has been selected
    var $title = $('#content h1');
    var logRequest = spy.getCall(spy.callCount - 1);
    assert.equal(logRequest.args[0], Balanced.Log);
    assert.equal(logRequest.args[1], '/v1/logs?limit=20&method%5Bin%5D=post%2Cput%2Cdelete&offset=0&q=&sort=created_at%2Cdesc');
    assert.notEqual($title.text().indexOf('Logs'), -1, 'Title is not correct');
});

test('has logs in table', function (assert) {
    // click the logs link
    $('#marketplace-nav .logs a').click();

    assert.equal($('table.logs tbody tr').length, 20, 'has 20 logs');
    assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');

    // click load more
    $('table.logs tfoot tr a').click();

    assert.equal($('table.logs tbody tr').length, 40, 'has 40 logs');
    assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');
});

test('filter logs by endpoint bank accounts', function (assert) {
    // click the logs link
    $('#marketplace-nav .logs a').click();

    assert.equal($('table.logs tbody tr').length, 20, 'has 20 logs');
    assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');

    // click filer by endpoint bank accounts
    $('.results li.filter-endpoints ul li.bank_accounts a').click();

    assert.equal($('table.logs tbody tr').length, 8, 'has 8 logs');
});

test('filter logs by request failed only', function (assert) {
    var spy = sinon.spy(Balanced.Adapter, 'get');

    // click the logs link
    $('#marketplace-nav .logs a').click();

    assert.equal($('table.logs tbody tr').length, 20, 'has 20 logs');
    assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');

    // uncheck filter by request succeeded
    $('.results .filter-status-rollup label.succeeded input[type="checkbox"]').click().trigger('checked');

    var logRequest = spy.getCall(spy.callCount - 1);

    assert.equal(logRequest.args[0], Balanced.Log);
    assert.equal(logRequest.args[1],
        '/v1/logs?limit=20&method%5Bin%5D=post%2Cput%2Cdelete&offset=0&q=&sort=created_at%2Cdesc&status_rollup%5Bin%5D=3xx%2C4xx%2C5xx');

    assert.equal($('table.logs tbody tr').length, 20, 'has 20 logs');
    assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');

    // check the first row is the log we expect
    assert.equal(
        $('table.logs tbody tr td a').first().attr('href'),
        '/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/logs/OHM9d1fc57cf94111e291bb026ba7d31e6f');
});

test('view a particular log entry', function (assert) {
    // click the logs link
    $('#marketplace-nav .logs a').click();

    $('table.logs tbody tr a').first().click();

    assert.equal($('h1.page-title').text(), 'POST /v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications', 'h1 title is correct');

    assert.equal($('#log-request-id').text(), 'OHMa2a01fecf94111e2ab70026ba7cac9da', 'Log request id matches');
});
