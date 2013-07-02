module('Marketplaces Settings', {
    setup: function () {
        Testing.selectMarketplaceByName();

        // click the settings link
        $('#marketplace-nav .settings a').click();
    }, teardown: function () {

    }
});

test('can visit page', function (assert) {
    //  check the page title has been selected
    var $title = $('#content h1');

    assert.notEqual($title.text().indexOf('Settings'), -1, 'Title is not correct');
});


test('can update marketplace info', function (assert) {
    // click the button to edit marketplace info
    $('.marketplace-info a.edit').click();
    // change the text for marketplace name
    $('#edit-marketplace-info .modal-body input').first().val('TEST').trigger('keyup');
    // click save
    $('#edit-marketplace-info .modal-footer button')[1].click();

    // Marketplace name should have changed
    assert.equal($('.marketplace-info div.control-group:nth-child(2) .inline-label').text().trim(), 'TEST');
});

test('can create bank accounts', function (assert) {
    var createsBefore = Balanced.Adapter.creates.length;

    // There are two bank accounts added to the fixture, used for add and withdraw funds
    assert.equal($('.bank-account-info .sidebar-items li').length, 2);

    // click the button to add a bank account
    $('.bank-account-info a.add').click();
    // fill out information
    $('#add-bank-account .modal-body input').eq(0).val('TEST').trigger('keyup');
    $('#add-bank-account .modal-body input').eq(1).val('123').trigger('keyup');
    $('#add-bank-account .modal-body input').eq(2).val('123123123').trigger('keyup');
    $('#add-bank-account .modal-body input').eq(3).val('checking').trigger('keyup');
    // click save
    $('#add-bank-account .modal-footer button')[1].click();

    // should be two creates, one for the bank account and one for the verification
    assert.equal(Balanced.Adapter.creates.length, createsBefore + 2);
});

test('shows webhooks', function (assert) {
    assert.equal($('ul.webhooks li').length, 2);
});

test('can delete webhooks', function (assert) {
    assert.equal($('ul.webhooks li').length, 2);

    // click the link to delete the webhook
    $('ul.webhooks li').first().find('a').click();
    // click OK
    $('#delete-callback .modal-footer button')[1].click();

    // now there should only be one
    assert.equal($('ul.webhooks li').length, 1);
});
