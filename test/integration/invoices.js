module('Invoices', {
    setup: function () {
        Testing.selectMarketplaceByName();
    }, teardown: function () {

    }
});

test('can visit page', function (assert) {
    // click the invoices link
    $('#marketplace-nav .invoices a').click();

    //  check the page title has been selected
    var $title = $('#content h1');

    assert.notEqual($title.text().indexOf('Invoices'), -1);
});
