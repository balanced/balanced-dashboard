module('Invoices');

test('can visit page', function (assert) {
    Testing.selectMarketplaceByName();

    // click the activity link
    $('#marketplace-nav .invoices a').click();

    //  check the page title has been selected
    var $title = $('#content h1');

    assert.notEqual($title.text().indexOf('Invoices'), -1);
});
