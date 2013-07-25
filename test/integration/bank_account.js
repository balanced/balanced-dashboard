module('Bank Account Page', {
    setup: function () {
        Testing.selectMarketplaceByName();

        // click the settings link
        $('#marketplace-nav .settings a').click();

        // click on the first bank account
        $(".bank-account-info .sidebar-items li").first().find(".name").click();
    }, teardown: function () {
        $('#credit-bank-account').modal('hide');
        $('#debit-funding-instrument').modal('hide');
        $('#verify-bank-account').modal('hide');
        $('#confirm-verification').modal('hide');
    }
});

test('can view bank account page', function (assert) {
    assert.equal($('#content h1').text().trim(), 'Bank Account');
    assert.equal($(".title span").text().trim(), 'Test (5555)');
});

test('credit bank account', function (assert) {
    var createsBefore = Balanced.Adapter.creates.length;

    assert.equal($(".main-header .buttons a.credit-button").length, 1);

    // click the credit button
    $(".main-header .buttons a.credit-button").click();

    $('#credit-bank-account .modal-body input[name="dollar_amount"]').val("1000").trigger('keyup');
    $('#credit-bank-account .modal-body input[name="description"]').val("Test debit").trigger('keyup');

    // click credit
    $('#credit-bank-account .modal-footer button[name="modal-submit"]').click();

    // should be one create for the debit
    assert.equal(Balanced.Adapter.creates.length, createsBefore + 1);
});

test('crediting only submits once despite multiple clicks', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");

    // click the credit button
    $(".main-header .buttons a.credit-button").click();

    $('#credit-bank-account .modal-body input[name="dollar_amount"]').val("1000").trigger('keyup');
    $('#credit-bank-account .modal-body input[name="description"]').val("Test debit").trigger('keyup');

    // click credit
    for (var i = 0; i < 20; i++) {
        $('#credit-bank-account .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});

test('debit bank account', function (assert) {
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

test('can initiate bank account verification', function(assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");

    // click the settings link
    $('#marketplace-nav .settings a').click();

    // click on the third bank account (which has no verification)
    $(".bank-account-info .sidebar-items li").eq(2).find(".name").click();

    assert.equal($('#content h1').text().trim(), 'Bank Account');

    assert.equal($(".main-header .buttons a.verify-button").length, 1, 'has verify button');

    // click the verify button
    $(".main-header .buttons a.verify-button").click();

    assert.equal($('#verify-bank-account').css('display'), 'block', 'verify bank account modal visible');

    $('#verify-bank-account .modal-footer button[name="modal-submit"]').click();

    assert.ok(stub.calledOnce);
});

test('can confirm bank account verification', function(assert) {
    var stub = sinon.stub(Balanced.Adapter, "update");

    // click the settings link
    $('#marketplace-nav .settings a').click();

    // click on the fourth bank account (which has a pending verification)
    $(".bank-account-info .sidebar-items li").eq(3).find(".name").click();

    assert.equal($('#content h1').text().trim(), 'Bank Account');

    assert.equal($(".main-header .buttons a.confirm-verification-button").length, 1, 'has confirm button');

    // click the confirm button
    $(".main-header .buttons a.confirm-verification-button").click();

    assert.equal($('#confirm-verification').css('display'), 'block', 'confirm verification modal visible');

    $('#confirm-verification .modal-body input[name="amount_1"]').val('1.00').trigger('keyup');
    $('#confirm-verification .modal-body input[name="amount_2"]').val('1.00').trigger('keyup');

    $('#confirm-verification .modal-footer button[name="modal-submit"]').click();

    assert.ok(stub.calledOnce);
});
