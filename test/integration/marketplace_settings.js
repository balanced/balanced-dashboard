module('Marketplaces Settings', {
    setup: function () {
        Testing.selectMarketplaceByName();

        // click the settings link
        $('#marketplace-nav .settings a').click();
    }, teardown: function () {
        $("#add-bank-account").modal('hide');
        $("#verify-bank-account").modal('hide');
        $("#delete-bank-account").modal('hide');
        $("#add-card").modal('hide');
        $("#delete-card").modal('hide');
        $("#add-callback").modal('hide');
        $("#delete-callback").modal('hide');
        $('#edit-marketplace-info').modal('hide');
        $('#edit-owner-info').modal('hide');
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
    $('#edit-marketplace-info .modal-body input[name="name"]').val('TEST').trigger('keyup');
    // click save
    $('#edit-marketplace-info .modal-footer button[name="modal-submit"]').click();

    // Marketplace name should have changed
    assert.equal($('.marketplace-info div.control-group:nth-child(2) .inline-label').text().trim(), 'TEST');
});

test('updating marketplace info only submits once despite multiple clicks', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "update");

    // click the button to edit marketplace info
    $('.marketplace-info a.edit').click();
    // change the text for marketplace name
    $('#edit-marketplace-info .modal-body input[name="name"]').val('TEST').trigger('keyup');
    // click save
    for(var i = 0; i < 20; i++) {
        $('#edit-marketplace-info .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});

test('can update owner info', function (assert) {
    // click the button to edit marketplace info
    $('.owner-info a.edit').click();
    // change the text for marketplace name
    $('#edit-owner-info .modal-body input[name="name"]').val('TEST').trigger('keyup');
    // click save
    $('#edit-owner-info .modal-footer button[name="modal-submit"]').click();

    // Marketplace name should have changed
    assert.equal($('.owner-info div.control-group:nth-child(2) .inline-label').text().trim(), 'TEST');
});

test('updating owner info only submits once despite multiple clicks', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "update");

    // click the button to edit marketplace info
    $('.owner-info a.edit').click();
    // change the text for marketplace name
    $('#edit-owner-info .modal-body input').first().val('TEST').trigger('keyup');
    // click save
    for(var i = 0; i < 20; i++) {
        $('#edit-owner-info .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});

test('can create bank accounts', function (assert) {
    var spy = sinon.spy(Balanced.Adapter, "create");

    // There are two bank accounts added to the fixture, used for add and withdraw funds
    assert.equal($('.bank-account-info .sidebar-items li').length, 2);

    // click the button to add a bank account
    $('.bank-account-info a.add').click();
    // fill out information
    $('#add-bank-account .modal-body input[name="name"]').val('TEST').trigger('keyup');
    $('#add-bank-account .modal-body input[name="account_number"]').val('123').trigger('keyup');
    $('#add-bank-account .modal-body input[name="routing_number"]').val('123123123').trigger('keyup');
    $('#add-bank-account .modal-body input[name="account_type"]').val('checking').trigger('keyup');
    // click save
    $('#add-bank-account .modal-footer button[name="modal-submit"]').click();

    // should be two creates, one for the bank account and one for the verification
    assert.ok(spy.calledTwice);
});

test('create bank account only submits once when clicked multiple times', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");

    // click the button to add a bank account
    $('.bank-account-info a.add').click();
    // fill out information
    $('#add-bank-account .modal-body input[name="name"]').val('TEST').trigger('keyup');
    $('#add-bank-account .modal-body input[name="account_number"]').val('123').trigger('keyup');
    $('#add-bank-account .modal-body input[name="routing_number"]').val('123123123').trigger('keyup');
    $('#add-bank-account .modal-body input[name="account_type"]').val('checking').trigger('keyup');
    // click save
    for(var i = 0; i < 20; i++) {
        $('#add-bank-account .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});

test('can verify bank accounts', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "update");

    assert.equal($('.bank-account-info .sidebar-items li.unverified').length, 1);

    // click the verify button
    $(".bank-account-info .sidebar-items li.unverified").first().find(".actions button").click();

    // fill out information
    $('#verify-bank-account .modal-body input[name="amount_1"]').val('1.00').trigger('keyup');
    $('#verify-bank-account .modal-body input[name="amount_2"]').val('1.00').trigger('keyup');

    // click save
    $('#verify-bank-account .modal-footer button[name="modal-submit"]').click();

    assert.ok(stub.calledOnce, "Update should have been called once");
});

test('verifying bank accounts only happens once despite multiple clicks', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "update");

    assert.equal($('.bank-account-info .sidebar-items li.unverified').length, 1);

    // click the verify button
    $(".bank-account-info .sidebar-items li.unverified").first().find(".actions button").click();

    // fill out information
    $('#verify-bank-account .modal-body input[name="amount_1"]').val('1.00').trigger('keyup');
    $('#verify-bank-account .modal-body input[name="amount_2"]').val('1.00').trigger('keyup');

    // click save
    for(var i = 0; i < 20; i++) {
        $('#verify-bank-account .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce, "Update should have been called once");
});

test('can delete bank accounts', function (assert) {
    var spy = sinon.spy(Balanced.Adapter, "delete");

    assert.equal($('.bank-account-info .sidebar-items li').length, 2);

    // click the delete button
    $(".bank-account-info .sidebar-items li").first().find(".icon-delete").click();

    // click save
    $('#delete-bank-account .modal-footer button[name="modal-submit"]').click();

    assert.equal($('.bank-account-info .sidebar-items li').length, 1);
    assert.ok(spy.calledOnce, "Delete should have been called once");
});

test('delete bank accounts only deletes once when submit clicked multiple times', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "delete");

    // click the delete button
    $(".bank-account-info .sidebar-items li").first().find(".icon-delete").click();

    // click save
    for(var i = 0; i < 20; i++) {
        $('#delete-bank-account .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce, "Delete should have been called once");
});

test('can create cards', function (assert) {
    var spy = sinon.spy(Balanced.Adapter, "create");

    // click the button to add a bank account
    $('.card-info a.add').click();
    // fill out information
    $('#add-card .modal-body input[name="name"]').val('TEST').trigger('keyup');
    $('#add-card .modal-body input[name="card_number"]').val('1234123412341234').trigger('keyup');
    $('#add-card .modal-body input[name="security_code"]').val('123').trigger('keyup');
    $('#add-card .modal-body input[name="expiration_month"]').val('01').trigger('keyup');
    $('#add-card .modal-body input[name="expiration_month"]').val('2020').trigger('keyup');
    // click save
    $('#add-card .modal-footer button[name="modal-submit"]').click();

    assert.ok(spy.calledOnce);
});

test('create card only submits once when clicked multiple times', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");

    // click the button to add a bank account
    $('.card-info a.add').click();
    // fill out information
    $('#add-card .modal-body input[name="name"]').val('TEST').trigger('keyup');
    $('#add-card .modal-body input[name="card_number"]').val('1234123412341234').trigger('keyup');
    $('#add-card .modal-body input[name="security_code"]').val('123').trigger('keyup');
    $('#add-card .modal-body input[name="expiration_month"]').val('01').trigger('keyup');
    $('#add-card .modal-body input[name="expiration_month"]').val('2020').trigger('keyup');
    // click save
    for(var i = 0; i < 20; i++) {
        $('#add-card .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});

test('can delete cards', function (assert) {
    var spy = sinon.spy(Balanced.Adapter, "delete");

    assert.equal($('.card-info .sidebar-items li').length, 2);

    // click the delete button
    $(".card-info .sidebar-items li").first().find(".icon-delete").click();

    // click save
    $('#delete-card .modal-footer button[name="modal-submit"]').click();

    assert.equal($('.card-info .sidebar-items li').length, 1);
    assert.ok(spy.calledOnce, "Delete should have been called once");
});

test('delete cards only deletes once when submit clicked multiple times', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "delete");

    // click the delete button
    $(".card-info .sidebar-items li").first().find(".icon-delete").click();

    // click save
    for(var i = 0; i < 20; i++) {
        $('#delete-card .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce, "Delete should have been called once");
});

test('shows webhooks', function (assert) {
    assert.equal($('ul.webhooks li').length, 2);
});

test('can add webhooks', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");

    // click add webhook button
    $(".webhook-info .add").click();

    // fill out
    $("#add-callback .modal-body input[name='url']").val('http://www.example.com/something').trigger('keyup');

    // click save
    $('#add-callback .modal-footer button[name="modal-submit"]').click();

    assert.ok(stub.calledOnce);
});

test('webhooks get created once if submit button is clicked multiple times', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");

    // click add webhook button
    $(".webhook-info .add").click();

    // fill out
    $("#add-callback .modal-body input[name='url']").val('http://www.example.com/something').trigger('keyup');

    // click save
    for(var i = 0; i < 20; i++) {
        $('#add-callback .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});

test('can delete webhooks', function (assert) {
    assert.equal($('ul.webhooks li').length, 2);

    // click the link to delete the webhook
    $('ul.webhooks li').first().find('a').click();
    // click OK
    $('#delete-callback .modal-footer button[name="modal-submit"]').click();

    // now there should only be one
    assert.equal($('ul.webhooks li').length, 1);
});

test('delete webhooks only submits once even if clicked multiple times', function (assert) {
    var spy = sinon.stub(Balanced.Adapter, "delete");

    // click the link to delete the webhook
    $('ul.webhooks li').first().find('a').click();
    // click OK
    for(var i = 0; i < 20; i++) {
        $('#delete-callback .modal-footer button[name="modal-submit"]').click();
    }

    // now there should only be one
    assert.ok(spy.calledOnce);
});