var customerPage = '/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/customers/AC5m0wzuMTw3JbKP4uIZXFpC';

module('Customer Page', {
    setup: function () {
        Testing.selectMarketplaceByName();

        // click the customers tab on the activity page
        $("#activity header .accounts a").click();

        // click on the first customer
        $("table.accounts tbody tr a").eq(0).click();
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

test('can update customer info', function (assert) {
    var spy = sinon.spy(Balanced.Adapter, "update");

	visit(customerPage)
	.click('.customer-info a.edit')
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

test('can debit customer using card', function (assert) {
    var spy = sinon.spy(Balanced.Adapter, "create");
    Balanced.Adapter.asyncCallbacks = true;

    Testing.selectMarketplaceByName();

    wait().then(function() {
        // click the customers tab on the activity page
        return click("#activity header .accounts a");
    }).then(function() {
        // click on the first customer
        return click($("table.accounts tbody tr a").eq(0));
    }).then(function() {
        // click the debit customer button
        return click(".customer-header .buttons a.debit-customer");
    }).then(function() {
        assert.equal($("#debit-customer form select[name='source_uri'] option").length, 2);

        // bank accounts first
        assert.equal($("#debit-customer form select[name='source_uri'] option").eq(0).text(), "Bank Account: 123");
        // cards second
        assert.equal($("#debit-customer form select[name='source_uri'] option").eq(1).text(), "Card: 0005 (American Express)");

        // select the card
        $("#debit-customer select[name='source_uri']").val($("#debit-customer form select[name='source_uri'] option").eq(1).attr('value'));

        $('#debit-customer .modal-body input[name="dollar_amount"]').val("1000").trigger('keyup');
        $('#debit-customer .modal-body input[name="description"]').val("Test debit").trigger('keyup');

        // click debit
        return click('#debit-customer .modal-footer button[name="modal-submit"]');
    }).then(function() {
        // should be one create for the debit
        assert.ok(spy.calledOnce);
    });
});

test('can debit customer using bank account', function (assert) {
    var createsBefore = Balanced.Adapter.creates.length;

    // click the debit customer button
    $(".customer-header .buttons a").eq(0).click();

    assert.equal($("#debit-customer form select[name='source_uri'] option").length, 2);

    // bank accounts first
    assert.equal($("#debit-customer form select[name='source_uri'] option").eq(0).text(), "Bank Account: 123");
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

    $('#debit-customer .modal-body input[name="dollar_amount"]').val("1000").trigger('keyup');
    $('#debit-customer .modal-body input[name="description"]').val("Test debit").trigger('keyup');

    // click debit
    for (var i = 0; i < 20; i++) {
        $('#debit-customer .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});

test("debit customer triggers reload of transactions", function (assert) {
    // click the debit customer button
    $(".customer-header .buttons a").eq(0).click();

    $('#debit-customer .modal-body input[name="dollar_amount"]').val("1000").trigger('keyup');
    $('#debit-customer .modal-body input[name="description"]').val("Test debit").trigger('keyup');

    var stub = sinon.stub(Balanced.Adapter, "get");

    // click debit
    $('#debit-customer .modal-footer button[name="modal-submit"]').click();

    assert.ok(stub.calledWith(Balanced.Transaction));
});

test('can credit customer', function (assert) {
    var createsBefore = Balanced.Adapter.creates.length;

    // click the credit customer button
    $(".customer-header .buttons a").eq(1).click();

    $('#credit-customer .modal-body input[name="dollar_amount"]').val("1000").trigger('keyup');
    $('#credit-customer .modal-body input[name="description"]').val("Test credit").trigger('keyup');

    // click credit
    $('#credit-customer .modal-footer button[name="modal-submit"]').click();

    // should be one create for the debit
    assert.equal(Balanced.Adapter.creates.length, createsBefore + 1);
});

test('when crediting customer triggers an error, the error is displayed to the user', function (assert) {
    // click the credit customer button
    $(".customer-header .buttons a").eq(1).click();

    $('#credit-customer .modal-body input[name="dollar_amount"]').val("1000").trigger('keyup');
    $('#credit-customer .modal-body input[name="description"]').val("Test credit").trigger('keyup');

    var stub = sinon.stub(Balanced.Adapter, "create");
    stub.callsArgWith(4, { status: 400, responseText: "", responseJSON: {extras: {}, description: "My error"}}, null, null);

    // click credit
    $('#credit-customer .modal-footer button[name="modal-submit"]').click();

    assert.equal($('.alert-error').first().text().trim(), "My error");
});

test("can't credit customer multiple times using the same modal", function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");

    // click the credit customer button
    $(".customer-header .buttons a").eq(1).click();

    $('#credit-customer .modal-body input[name="dollar_amount"]').val("1000").trigger('keyup');
    $('#credit-customer .modal-body input[name="description"]').val("Test credit").trigger('keyup');

    // click credit
    for (var i = 0; i < 20; i++) {
        $('#credit-customer .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});

test('can add bank account', function (assert) {
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
    assert.ok(createSpy.calledWith(Balanced.BankAccount, '/v1/customers/AC5m0wzuMTw3JbKP4uIZXFpC/bank_accounts', {
        bank_account_uri: '/v1/bank_accounts/deadbeef'
    }));
});

test('can add card', function (assert) {
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
    assert.ok(createSpy.calledWith(Balanced.Card, '/v1/customers/AC5m0wzuMTw3JbKP4uIZXFpC/cards', {
        card_uri: '/v1/cards/deadbeef'
    }));
});
