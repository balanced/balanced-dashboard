module('Customers', {
    setup: function () {
        Testing.selectMarketplaceByName();
    }, teardown: function () {

    }
});

test('can visit create new customer ', function (assert) {
    // click the activity link
    $('#marketplace-actions .add-customer a').click();

    //  check the page title has been selected
    var $title = $('#content h1');
    assert.equal($title.text().trim(), 'Create a new customer');
});
