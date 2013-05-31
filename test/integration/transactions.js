module('Transactions', {
    setup: function () {
        Testing.selectMarketplaceByName();

        // click the activity link
        $('#marketplace-nav .activity a').click();
    }, teardown: function () {

    }
});

test('can visit page', function (assert) {

    var $title = $('#content h1');

    assert.notEqual($title.text().indexOf('Transactions'), -1,
        'Title is incorrect');
    assert.notEqual($title.text().indexOf('Download'), -1,
        'Download link not in title');

});

// This test will not pass until we add a bank account to our marketplace
// fixtures but highlights a bug when you do not have a verified bank account
// associated to your marketplace.
//test('can view withdraw modal', function (assert) {
//    $('.escrow-box').find('a:contains("Add funds")').click();
//    var modal = $('#add-funds:visible');
//    assert.equal(modal.length, 1,
//        'Add funds modal not visible after clicking button');
//});

