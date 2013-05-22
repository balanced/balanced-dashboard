module('Invoices');

test('can visit page', function () {
    Testing.selectMarketplaceByName();

    // click the activity link
    $('#marketplace-nav .invoices a').click();

    //  check the page title has been selected
    var $title = $('#content h1');

    notEqual($title.text().indexOf('Invoices'), -1);
});
