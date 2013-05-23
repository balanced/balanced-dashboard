module('Settings', {
    setup: function () {
        Testing.selectMarketplaceByName();
    }, teardown: function () {

    }
});

test('can visit page', function (assert) {

    // click the activity link
    $('#marketplace-nav .settings a').click();

    //  check the page title has been selected
    var $title = $('#content h1');

    assert.notEqual($title.text().indexOf('Settings'), -1, 'Title is not correct');
});
