module('Transactions');

test('can visit page', function () {
    Testing.selectMarketplaceByName();
    // click the activity link
    $('#marketplace-nav .activity a').click();

    //  check the page title has been selected
    var $title = $('#content h1');

    notEqual($title.text().indexOf('Transactions'), -1);
    notEqual($title.text().indexOf('Download'), -1);
    $title.find('a').click();

    var modal = $('#download-confirm:visible');
    console.log('dl conf');
    console.log($title.find('a').text());
    console.log($('#download-confirm').length);
    equal(modal.length, 1);
});
