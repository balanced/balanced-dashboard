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

    assert.equal($('table.logs tbody tr').length, 20, 'has 20 logs');
    assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');

    // click load more
    $("table.logs tfoot tr a").click();

    assert.equal($('table.logs tbody tr').length, 40, 'has 40 logs');
    assert.equal($('table.logs tfoot td').length, 1, 'has "load more"');
});

test('view a particular log entry', function (assert) {
    // click the logs link
    $('#marketplace-nav .logs a').click();

    $("table.logs tbody tr a").first().click();

    assert.equal($("h1.page-title").text(), 'POST /v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications', 'h1 title is correct');

    assert.equal($("#log-request-id").text(), 'OHMa2a01fecf94111e2ab70026ba7cac9da', 'Log request id matches');
});