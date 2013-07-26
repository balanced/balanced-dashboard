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

    assert.equal($("h1.page-title").text(), 'POST /v1/marketplaces', 'h1 title is correct');

    assert.equal($("#log-request-id").text(), 'OHM2c0c5fd4df8911e2a42a026ba7cac9da', 'Log request id matches');
});