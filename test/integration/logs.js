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
    assert.equal($('table .logs tbody tr').length, 10, 'has 10 logs');
    assert.equal($('table .logs tfoot td').length, 1, 'has "load more"');
});