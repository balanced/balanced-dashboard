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

test('can view download modal', function (assert) {
    var $title = $('#content h1');

    $title.find('a').click();

    var modal = $('#download-confirm:visible');
    assert.equal(modal.length, 1,
        'Download modal not visible after clicking download button');
});
