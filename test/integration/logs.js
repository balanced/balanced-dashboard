module('Logs', {
    setup: function () {
        Testing.selectMarketplaceByName();
    }, teardown: function () {

    }
});

test('can visit page', function (assert) {
    // click the logs link
    $('#marketplace-nav .logs a').click();

    //  check the page title has been selected
    var $title = $('#content h1');

    assert.notEqual($title.text().indexOf('Logs'), -1, 'Title is not correct');
});

test('has logs in table', function (assert) {
    // click the logs link
    $('#marketplace-nav .logs a').click();

    assert.equal($('table.logs tbody tr').length, 10, 'has 10 logs');
    assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');
});

test('view a particular log entry', function (assert) {
    // click the logs link
    $('#marketplace-nav .logs a').click();

    $("table.logs tbody tr").first().click();

    assert.equal($("h1.page-title").text(), 'PUT /v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications/BZ3Id7dzTwISb8XlR3jpxbiU', 'h1 title is correct');

    assert.equal($("#log-request-id").text(), 'OHM7eb02462f32211e28797026ba7d31e6f', 'Log request id matches');
});