module('Pay Seller', {
    setup: function () {
        Testing.selectMarketplaceByName();
    }, teardown: function () {

    }
});

test('can pay a seller', function (assert) {
    var createsBefore = Balanced.Adapter.creates.length;

    // click the button to pay a seller
    $('li.pay-seller a').click();

    // fill out information
    $('#pay-seller .modal-body input').eq(0).val('TEST').trigger('keyup');
    $('#pay-seller .modal-body input').eq(1).val('123123123').trigger('keyup');
    $('#pay-seller .modal-body input').eq(2).val('123123123').trigger('keyup');
    $('#pay-seller .modal-body input').eq(3).val('checking').trigger('keyup');
    $('#pay-seller .modal-body input').eq(4).val('98').trigger('keyup');
    $('#pay-seller .modal-body input').eq(5).val('Test Transaction').trigger('keyup');
    // click save
    $('#pay-seller .modal-footer button')[1].click();

    // should be one create
    assert.equal(Balanced.Adapter.creates.length, createsBefore + 1);
});
