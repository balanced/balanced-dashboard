module('Transactions');

test('can visit page', function (assert) {
    Testing.selectMarketplaceByName();
    // click the activity link
    $('#marketplace-nav .activity a').click();

    //  check the page title has been selected
    var $title = $('#content h1');

    assert.notEqual($title.text().indexOf('Transactions'), -1);
    assert.notEqual($title.text().indexOf('Download'), -1);
    $title.find('a').click();

    var modal = $('#download-confirm:visible');
    assert.equal(modal.length, 1);
});
