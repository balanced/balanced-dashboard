module('Card Page', {
    setup: function () {
        Testing.selectMarketplaceByName();

        // click the settings link
        $('#marketplace-nav .settings a').click();

        // click on the first card
        $(".card-info .sidebar-items li").first().find(".name a").click()
    }, teardown: function () {
        $('#debit-funding-instrument').modal('hide');
    }
});

test('can view card page', function (assert) {
    assert.equal($('#content h1').text().trim(), 'Card');
    assert.equal($(".title span").text().trim(), 'Test Card 1 (0005)');
});

test('debit card', function (assert) {
    var createsBefore = Balanced.Adapter.creates.length;

    assert.equal($(".main-header .buttons a.debit-button").length, 1);

    // click the debit button
    $(".main-header .buttons a.debit-button").click();

    $('#debit-funding-instrument .modal-body input[name="dollar_amount"]').val("1000").trigger('keyup');
    $('#debit-funding-instrument .modal-body input[name="description"]').val("Test debit").trigger('keyup');

    // click debit
    $('#debit-funding-instrument .modal-footer button[name="modal-submit"]').click();

    // should be one create for the debit
    assert.equal(Balanced.Adapter.creates.length, createsBefore + 1);
});

test('debiting only submits once despite multiple clicks', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");

    // click the debit button
    $(".main-header .buttons a.debit-button").click();

    $('#debit-funding-instrument .modal-body input[name="dollar_amount"]').val("1000").trigger('keyup');
    $('#debit-funding-instrument .modal-body input[name="description"]').val("Test debit").trigger('keyup');

    // click debit
    for (var i = 0; i < 20; i++) {
        $('#debit-funding-instrument .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});
