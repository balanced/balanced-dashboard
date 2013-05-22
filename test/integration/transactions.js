module('Transactions');

test('can visit page', function () {
    //  select a marketplace
    $('#marketplaces ul a:contains("Test Marketplace")').click();
    // click the activity link
    $('#marketplace-nav .activity a').click();

    //  check the page title has been selected
    var $title = $('#content h1');

    notEqual($title.text().indexOf('Transactions'), -1);
    notEqual($title.text().indexOf('Download'), -1);
    $title.find('a').click();

    var modal = $('#download-confirm:visible');
    equal(modal.length, 1);
});
