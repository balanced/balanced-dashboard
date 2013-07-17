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
    }
});

test('can view customer page', function (assert) {
    assert.equal($('#content h1').text().trim(), 'Customer');
    assert.equal($(".title span").text().trim(), 'Nick1');
});

test('can debit customer', function (assert) {
    var createsBefore = Balanced.Adapter.creates.length;

    // click the debit customer button
    $(".customer-header .buttons a").eq(0).click();

    $('#debit-customer .modal-body input').eq(0).val("1000").trigger('keyup');
    $('#debit-customer .modal-body input').eq(1).val("Test debit").trigger('keyup');

    // click debit
    $('#debit-customer .modal-footer button').eq(1).click();

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
    for(var i = 0; i < 20; i++) {
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
    for(var i = 0; i < 20; i++) {
        $('#credit-customer .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});

test('can edit customer info', function (assert) {
    var updatesBefore = Balanced.Adapter.updates.length;

    $(".marketplace-info header a.edit").click();

    $('#edit-customer-info .modal-body input').eq(0).val("My Test Company").trigger('keyup');

    $('#edit-customer-info .modal-footer button').eq(1).click();

    // should have posted the update
    assert.equal(Balanced.Adapter.updates.length, updatesBefore + 1);
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
