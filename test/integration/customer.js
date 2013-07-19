module('Customer Page', {
    setup: function () {
        Testing.selectMarketplaceByName();

        // click the customers tab on the activity page
        $("#activity header .accounts a").click();

        // click on the first customer
        $("table.accounts tbody tr").eq(0).click();
    }, teardown: function () {
        $('#credit-customer').modal('hide');
        $('#debit-customer').modal('hide');
        $('#add-bank-account').modal('hide');
        $('#add-bank-account').modal('hide');
        $('#edit-customer-info').modal('hide');
    }
});

test('can view customer page', function (assert) {
    assert.equal($('#content h1').text().trim(), 'Customer');
    assert.equal($(".title span").text().trim(), 'Nick1');
});

test('can edit customer info', function (assert) {
    var spy = sinon.spy(Balanced.Adapter, "update");

    // click the button to edit customer info
    $('.customer-info a.edit').click();
    // change the text for marketplace name
    $('#edit-customer-info .modal-body input[name="name"]').val('TEST').trigger('keyup');
    // click save
    $('#edit-customer-info .modal-footer button[name="modal-submit"]').click();

    assert.ok(spy.calledOnce);
});

test('editing customer info only submits once despite multiple clicks', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "update");

    // click the button to edit customer info
    $('.customer-info a.edit').click();
    // change the text for marketplace name
    $('#edit-customer-info .modal-body input[name="name"]').val('TEST').trigger('keyup');
    // click save
    for (var i = 0; i < 20; i++) {
        $('#edit-customer-info .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});

test('can debit customer using card', function (assert) {
    var createsBefore = Balanced.Adapter.creates.length;

    // click the debit customer button
    $(".customer-header .buttons a").eq(0).click();

    assert.equal($("#debit-customer form select[name='source_uri'] option").length, 2);

    // bank accounts first
    assert.equal($("#debit-customer form select[name='source_uri'] option").eq(0).text(), "Bank account: 123");
    // cards second
    assert.equal($("#debit-customer form select[name='source_uri'] option").eq(1).text(), "Card: 0005 (American Express)");

    // select the card
    $("#debit-customer select[name='source_uri']").val($("#debit-customer form select[name='source_uri'] option").eq(1).attr('value'));

    $('#debit-customer .modal-body input[name="dollar_amount"]').val("1000").trigger('keyup');
    $('#debit-customer .modal-body input[name="description"]').val("Test debit").trigger('keyup');

    // click debit
    $('#debit-customer .modal-footer button[name="modal-submit"]').click();

    // should be one create for the debit
    assert.equal(Balanced.Adapter.creates.length, createsBefore + 1);
});

test('can debit customer using bank account', function (assert) {
    var createsBefore = Balanced.Adapter.creates.length;

    // click the debit customer button
    $(".customer-header .buttons a").eq(0).click();

    assert.equal($("#debit-customer form select[name='source_uri'] option").length, 2);

    // bank accounts first
    assert.equal($("#debit-customer form select[name='source_uri'] option").eq(0).text(), "Bank account: 123");
    // cards second
    assert.equal($("#debit-customer form select[name='source_uri'] option").eq(1).text(), "Card: 0005 (American Express)");

    // select the bank account
    $("#debit-customer select[name='source_uri']").val($("#debit-customer form select[name='source_uri'] option").eq(0).attr('value'));

    $('#debit-customer .modal-body input[name="dollar_amount"]').val("1000").trigger('keyup');
    $('#debit-customer .modal-body input[name="description"]').val("Test debit").trigger('keyup');

    // click debit
    $('#debit-customer .modal-footer button[name="modal-submit"]').click();

    // should be one create for the debit
    assert.equal(Balanced.Adapter.creates.length, createsBefore + 1);
});

test("can't debit customer multiple times using the same modal", function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");

    // click the debit customer button
    $(".customer-header .buttons a").eq(0).click();

    $('#debit-customer .modal-body input').eq(0).val("1000").trigger('keyup');
    $('#debit-customer .modal-body input').eq(1).val("Test debit").trigger('keyup');

    // click debit
    for (var i = 0; i < 20; i++) {
        $('#debit-customer .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});

test('can credit customer', function (assert) {
    var createsBefore = Balanced.Adapter.creates.length;

    // click the credit customer button
    $(".customer-header .buttons a").eq(1).click();

    $('#credit-customer .modal-body input').eq(0).val("1000").trigger('keyup');
    $('#credit-customer .modal-body input').eq(1).val("Test credit").trigger('keyup');

    // click credit
    $('#credit-customer .modal-footer button').eq(1).click();

    // should be one create for the debit
    assert.equal(Balanced.Adapter.creates.length, createsBefore + 1);
});

test("can't credit customer multiple times using the same modal", function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");

    // click the credit customer button
    $(".customer-header .buttons a").eq(1).click();

    $('#credit-customer .modal-body input').eq(0).val("1000").trigger('keyup');
    $('#credit-customer .modal-body input').eq(1).val("Test credit").trigger('keyup');

    // click credit
    for (var i = 0; i < 20; i++) {
        $('#credit-customer .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});

test('can add bank account', function (assert) {
    var createsBefore = Balanced.Adapter.creates.length;

    // click the button to add a bank account
    $('.bank-account-info a.add').click();
    // fill out information
    $('#add-bank-account .modal-body input').eq(0).val('TEST').trigger('keyup');
    $('#add-bank-account .modal-body input').eq(1).val('123').trigger('keyup');
    $('#add-bank-account .modal-body input').eq(2).val('123123123').trigger('keyup');
    $('#add-bank-account .modal-body input').eq(3).val('checking').trigger('keyup');
    // click save
    $('#add-bank-account .modal-footer button').eq(1).click();

    // should be two creates, one for the bank account and one for the verification
    assert.equal(Balanced.Adapter.creates.length, createsBefore + 2);
});

test('can add card', function (assert) {
    var createsBefore = Balanced.Adapter.creates.length;

    // click the button to add a bank account
    $('.card-info a.add').click();
    // fill out information
    $('#add-card .modal-body input').eq(0).val('TEST').trigger('keyup');
    $('#add-card .modal-body input').eq(1).val('123').trigger('keyup');
    $('#add-card .modal-body input').eq(2).val('123123123').trigger('keyup');
    $('#add-card .modal-body select').eq(0).val(1);
    $('#add-card .modal-body select').eq(1).val(2020);
    // click save
    $('#add-card .modal-footer button').eq(1).click();

    // should be one create
    assert.equal(Balanced.Adapter.creates.length, createsBefore + 1);
});
