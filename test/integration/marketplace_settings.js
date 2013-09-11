var settingsPath = '/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/settings';

module('Marketplaces Settings', {
    setup: function () {
        Testing.selectMarketplaceByName();

        // click the settings link
        $('#marketplace-nav .settings a').click();
    }, teardown: function () {
        $("#add-bank-account").modal('hide');
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
    for (var i = 0; i < 20; i++) {
        $('#edit-marketplace-info .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});

test('can update owner info', function (assert) {
    var spy = sinon.spy(Balanced.Adapter, "update");

	visit(settingsPath)
	.click('.owner-info a.edit')
	.fillIn('#edit-customer-info .modal-body input[name="name"]', 'TEST')
	.fillIn('#edit-customer-info .modal-body input[name="email"]', 'TEST@example.com')
	.fillIn('#edit-customer-info .modal-body input[name="business_name"]', 'TEST')
	.fillIn('#edit-customer-info .modal-body input[name="ein"]', '1234')
	.click('#edit-customer-info a.more-info')
	.fillIn('#edit-customer-info .modal-body input[name="street_address"]', '600 William St')
	.fillIn('#edit-customer-info .modal-body input[name="city"]', 'Oakland')
	.fillIn('#edit-customer-info .modal-body input[name="region"]', 'CA')
	.fillIn('#edit-customer-info .modal-body select[name="country_code"]', 'US')
	.fillIn('#edit-customer-info .modal-body input[name="postal_code"]', '12345')
	.fillIn('#edit-customer-info .modal-body input[name="phone"]', '1231231234')
	.fillIn('#edit-customer-info .modal-body input[name="dob_month"]', '12')
	.fillIn('#edit-customer-info .modal-body input[name="dob_year"]', '1924')
	.fillIn('#edit-customer-info .modal-body input[name="ssn_last4"]', '1234')
	.click('#edit-customer-info .modal-footer button[name="modal-submit"]')
	.then(function() {
		assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.Customer));
        assert.equal(spy.getCall(0).args[2].name, "TEST");
        assert.equal(spy.getCall(0).args[2].email, "TEST@example.com");
        assert.equal(spy.getCall(0).args[2].business_name, "TEST");
        assert.equal(spy.getCall(0).args[2].ein, "1234");
        assert.equal(spy.getCall(0).args[2].address.street_address, "600 William St");
        assert.equal(spy.getCall(0).args[2].address.city, "Oakland");
        assert.equal(spy.getCall(0).args[2].address.region, "CA");
        assert.equal(spy.getCall(0).args[2].address.country_code, "US");
        assert.equal(spy.getCall(0).args[2].address.postal_code, "12345");
        assert.equal(spy.getCall(0).args[2].phone, "1231231234");
        assert.equal(spy.getCall(0).args[2].dob, "1924-12");
        assert.equal(spy.getCall(0).args[2].ssn_last4, "1234");
	});
});

test('can create bank accounts', function (assert) {
    var createSpy = sinon.spy(Balanced.Adapter, "create");
    var tokenizingStub = sinon.stub(balanced.bankAccount, "create");
    tokenizingStub.callsArgWith(1, {
        status: 201,
        data: {
            uri: "/v1/bank_accounts/deadbeef"
        }
    });

    // Bank accounts added to the fixture, used for add and withdraw funds
    assert.equal($('.bank-account-info .sidebar-items li').length, 4);

    // click the button to add a bank account
    $('.bank-account-info a.add').click();
    // fill out information
    $('#add-bank-account .modal-body input[name="name"]').val('TEST').trigger('keyup');
    $('#add-bank-account .modal-body input[name="account_number"]').val('123').trigger('keyup');
    $('#add-bank-account .modal-body input[name="routing_number"]').val('123123123').trigger('keyup');
    $('#add-bank-account .modal-body input[name="account_type"][value="checking"]').click();
    // click save
    $('#add-bank-account .modal-footer button[name="modal-submit"]').click();

    assert.ok(tokenizingStub.calledOnce);
    assert.ok(tokenizingStub.calledWith({
        type: "checking",
        name: "TEST",
        account_number: "123",
        routing_number: "123123123"
    }));
    assert.ok(createSpy.calledOnce);
    assert.ok(createSpy.calledWith(Balanced.BankAccount, '/v1/customers/CU1DkfCFcAemmM99fabUso2c/bank_accounts', {
        bank_account_uri: '/v1/bank_accounts/deadbeef'
    }));
});

test('can create savings accounts', function (assert) {
    var createSpy = sinon.spy(Balanced.Adapter, "create");
    var tokenizingStub = sinon.stub(balanced.bankAccount, "create");
    tokenizingStub.callsArgWith(1, {
        status: 201,
        data: {
            uri: "/v1/bank_accounts/deadbeef"
        }
    });

    // click the button to add a bank account
    $('.bank-account-info a.add').click();
    // fill out information
    $('#add-bank-account .modal-body input[name="name"]').val('TEST').trigger('keyup');
    $('#add-bank-account .modal-body input[name="account_number"]').val('123').trigger('keyup');
    $('#add-bank-account .modal-body input[name="routing_number"]').val('123123123').trigger('keyup');
    $('#add-bank-account .modal-body input[name="account_type"][value="savings"]').click();
    // click save
    $('#add-bank-account .modal-footer button[name="modal-submit"]').click();

    assert.ok(tokenizingStub.calledOnce);

    // phantomjs can't handle the change events, so can't check the payload for now
    // TODO - put this back in when we're off phantomjs
    // assert.ok(tokenizingStub.calledWith({
    //     type: "savings",
    //     name: "TEST",
    //     account_number: "123",
    //     routing_number: "123123123"
    // }));

    assert.ok(createSpy.calledOnce);
    assert.ok(createSpy.calledWith(Balanced.BankAccount, '/v1/customers/CU1DkfCFcAemmM99fabUso2c/bank_accounts', {
        bank_account_uri: '/v1/bank_accounts/deadbeef'
    }));
});

test('create bank account only submits once when clicked multiple times', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");
    var tokenizingStub = sinon.stub(balanced.bankAccount, "create");
    tokenizingStub.callsArgWith(1, {
        status: 201,
        data: {
            uri: "/v1/bank_accounts/deadbeef"
        }
    });

    // click the button to add a bank account
    $('.bank-account-info a.add').click();
    // fill out information
    $('#add-bank-account .modal-body input[name="name"]').val('TEST').trigger('keyup');
    $('#add-bank-account .modal-body input[name="account_number"]').val('123').trigger('keyup');
    $('#add-bank-account .modal-body input[name="routing_number"]').val('123123123').trigger('keyup');
    $('#add-bank-account .modal-body input[name="account_type"]').val('checking').trigger('keyup');
    // click save
    for (var i = 0; i < 20; i++) {
        $('#add-bank-account .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(tokenizingStub.calledOnce);
    assert.ok(stub.calledOnce);
});

test('can delete bank accounts', function (assert) {
    var spy = sinon.spy(Balanced.Adapter, "delete");
    var initialLength = $('.bank-account-info .sidebar-items li').length;

    // click the delete button
    $(".bank-account-info .sidebar-items li").first().find(".icon-delete").click();

    // click save
    $('#delete-bank-account .modal-footer button[name="modal-submit"]').click();

    assert.equal($('.bank-account-info .sidebar-items li').length, initialLength - 1);
    assert.ok(spy.calledOnce, "Delete should have been called once");

    //  TODO: assert call to server was made
});

test('delete bank accounts only deletes once when submit clicked multiple times', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "delete");

    // click the delete button
    $(".bank-account-info .sidebar-items li").first().find(".icon-delete").click();

    // click save
    for (var i = 0; i < 20; i++) {
        $('#delete-bank-account .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce, "Delete should have been called once");
});

test('can create cards', function (assert) {
    var createSpy = sinon.spy(Balanced.Adapter, "create");
    var tokenizingStub = sinon.stub(balanced.card, "create");
    tokenizingStub.callsArgWith(1, {
        status: 201,
        data: {
            uri: "/v1/cards/deadbeef"
        }
    });

    // click the button to add a bank account
    $('.card-info a.add').click();
    // fill out information
    $('#add-card .modal-body input[name="name"]').val('TEST').trigger('keyup');
    $('#add-card .modal-body input[name="card_number"]').val('1234123412341234').trigger('keyup');
    $('#add-card .modal-body input[name="security_code"]').val('123').trigger('keyup');
    $('#add-card .modal-body select[name="expiration_month"] option[value="1"]').attr('selected', 'selected');
    $('#add-card .modal-body select[name="expiration_month"]').trigger('change');
    $('#add-card .modal-body select[name="expiration_year"] option[value="2020"]').attr('selected', 'selected');
    $('#add-card .modal-body select[name="expiration_year"]').trigger('change');

    // click save
    $('#add-card .modal-footer button[name="modal-submit"]').click();

    assert.ok(tokenizingStub.calledOnce);

    // phantomjs can't handle the change events, so can't check the payload for now
    // TODO - put this back in when we're off phantomjs
    // assert.ok(tokenizingStub.calledWith({
    //     card_number: "1234123412341234",
    //     expiration_month: 1,
    //     expiration_year: 2020,
    //     security_code: "123",
    //     name: "TEST"
    // }));

    assert.ok(createSpy.calledOnce);
    assert.ok(createSpy.calledWith(Balanced.Card, '/v1/customers/CU1DkfCFcAemmM99fabUso2c/cards', {
        card_uri: '/v1/cards/deadbeef'
    }));
});

test('create card only submits once when clicked multiple times', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");
    var tokenizingStub = sinon.stub(balanced.card, "create");
    tokenizingStub.callsArgWith(1, {
        status: 201,
        data: {
            uri: "/v1/cards/deadbeef"
        }
    });

    // click the button to add a bank account
    $('.card-info a.add').click();
    // fill out information
    $('#add-card .modal-body input[name="name"]').val('TEST').trigger('keyup');
    $('#add-card .modal-body input[name="card_number"]').val('1234123412341234').trigger('keyup');
    $('#add-card .modal-body input[name="security_code"]').val('123').trigger('keyup');
    $('#add-card .modal-body input[name="expiration_month"]').val('01').trigger('keyup');
    $('#add-card .modal-body input[name="expiration_month"]').val('2020').trigger('keyup');
    // click save
    for (var i = 0; i < 20; i++) {
        $('#add-card .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(tokenizingStub.calledOnce);
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

    //  TODO: assert server side call was made once.
});

test('delete cards only deletes once when submit clicked multiple times', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "delete");

    // click the delete button
    $(".card-info .sidebar-items li").first().find(".icon-delete").click();

    // click save
    for (var i = 0; i < 20; i++) {
        $('#delete-card .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce, "Delete should have been called once");

    //  TODO: assert server side call was made once.
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
    for (var i = 0; i < 20; i++) {
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
    for (var i = 0; i < 20; i++) {
        $('#delete-callback .modal-footer button[name="modal-submit"]').click();
    }

    // now there should only be one
    assert.ok(spy.calledOnce);
});
