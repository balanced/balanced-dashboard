var customerRoute;

module('Customer Page', {
	setup: function() {
		Balanced.TEST.setupMarketplace();
		customerRoute = '/marketplaces/' +
			Balanced.TEST.MARKETPLACE_ID + '/customers/' +
			Balanced.TEST.CUSTOMER_ID;
	},
	teardown: function() {}
});

test('can view customer page', function(assert) {
	visit(customerRoute)
		.then(function() {
			assert.equal($('#content h1').text().trim(), 'Customer');
			assert.equal($(".title span").text().trim(), 'William Henry Cavendish III');
		});
});

test('can edit customer info', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(customerRoute)
		.click('.customer-info a.edit')
		.fillIn('#edit-customer-info .modal-body input[name="name"]', 'TEST')
		.click('#edit-customer-info .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Customer));
			assert.ok(spy.getCall(0).args[2].name, 'TEST');
		});
});

test('can update customer info', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(customerRoute)
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

test('can debit customer using card', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");
	Balanced.Adapter.asyncCallbacks = true;

	visit(customerRoute);
	wait().then(function() {
		// click the debit customer button
		return click(".customer-header .buttons a.debit-customer");
	}).then(function() {
		assert.equal($("#debit-customer form select[name='source_uri'] option").length, 1);

		// bank accounts first
		assert.equal($("#debit-customer form select[name='source_uri'] option").eq(0).text(), "Bank Account: 5555 (Wells Fargo Bank Na)");
		// cards second
		assert.equal($("#debit-customer form select[name='source_uri'] option").eq(1).text(), "");

		// select the card
		$("#debit-customer select[name='source_uri']").val($("#debit-customer form select[name='source_uri'] option").eq(1).attr('value'));

		fillIn('#debit-customer .modal-body input[name="dollar_amount"]', '1000');
		fillIn('#debit-customer .modal-body input[name="description"]', 'Test debit');

		// click debit
		return click('#debit-customer .modal-footer button[name="modal-submit"]');
	}).then(function() {
		// should be one create for the debit
		assert.ok(spy.calledOnce);
		assert.ok(spy.calledWith(Balanced.Debit, '/v1/customers/' + Balanced.TEST.CUSTOMER_ID + '/debits', sinon.match({
			amount: 100000,
			description: "Test debit"
		})));
	});
});

test('can debit customer using bank account', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(customerRoute)
	// click the debit customer button
	.click($(".customer-header .buttons a").eq(0))
		.then(function() {
			assert.equal($("#debit-customer form select[name='source_uri'] option").length, 1);
		})
		.then(function() {
			// bank accounts first
			assert.equal($("#debit-customer form select[name='source_uri'] option").eq(0).text(), "Bank Account: 5555 (Wells Fargo Bank Na)");

			// cards second
			assert.equal($("#debit-customer form select[name='source_uri'] option").eq(1).text(), "");

			// select the bank account
			$("#debit-customer select[name='source_uri']").val($("#debit-customer form select[name='source_uri'] option").eq(0).attr('value'));

			fillIn('#debit-customer .modal-body input[name="dollar_amount"]', '1000');
			fillIn('#debit-customer .modal-body input[name="description"]', 'Test debit');

			// click debit
			click('#debit-customer .modal-footer button[name="modal-submit"]');

			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Debit, '/v1/customers/' + Balanced.TEST.CUSTOMER_ID + '/debits', sinon.match({
				amount: 100000,
				description: "Test debit"
			})));
		});
});

test("can't debit customer multiple times using the same modal", function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	// click the debit customer button
	visit(customerRoute)
		.click(".customer-header .buttons a")
		.fillIn('#debit-customer .modal-body input[name="dollar_amount"]', '1000')
		.fillIn('#debit-customer .modal-body input[name="description"]', 'Test debit')
		.then(function() {
			for (var i = 0; i < 20; i++) {
				click('#debit-customer .modal-footer button[name="modal-submit"]');
			}

			assert.ok(stub.calledOnce);
		});
});

test("debit customer triggers reload of transactions", function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "get");

	visit(customerRoute)
		.click($(".customer-header .buttons a").eq(0))
		.fillIn('#debit-customer .modal-body input[name="dollar_amount"]', '1000')
		.fillIn('#debit-customer .modal-body input[name="description"]', 'Test debit')
		.click('#debit-customer .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Transaction));
		});
});

test('can credit customer', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(customerRoute)
		.click($(".customer-header .buttons a").eq(1))
		.fillIn('#credit-customer .modal-body input[name="dollar_amount"]', '1000')
		.fillIn('#credit-customer .modal-body input[name="description"]', 'Test credit')
		.click('#credit-customer .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Credit, '/v1/customers/' + Balanced.TEST.CUSTOMER_ID + '/credits', sinon.match({
				amount: 100000,
				description: "Test credit"
			})));
		});
});

test('when crediting customer triggers an error, the error is displayed to the user', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");
	stub.callsArgWith(4, {
		status: 400,
		responseText: "",
		responseJSON: {
			extras: {},
			description: "My error"
		}
	}, null, null);

	visit(customerRoute)
		.click($(".customer-header .buttons a").eq(1))
		.fillIn('#credit-customer .modal-body input[name="dollar_amount"]', '1000')
		.fillIn('#credit-customer .modal-body input[name="description"]', 'Test credit')
		.click('#credit-customer .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.equal($('.alert-error').first().text().trim(), "My error");
		});
});

test("can't credit customer multiple times using the same modal", function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	// click the credit customer button
	visit(customerRoute)
		.click($(".customer-header .buttons a").eq(1))
		.fillIn('#credit-customer .modal-body input[name="dollar_amount"]', '1000')
		.fillIn('#credit-customer .modal-body input[name="description"]', 'Test credit')
		.then(function() {
			for (var i = 0; i < 20; i++) {
				click('#credit-customer .modal-footer button[name="modal-submit"]');
			}

			assert.ok(stub.calledOnce);
		});
});

test('can add bank account', function(assert) {
	var createSpy = sinon.spy(Balanced.Adapter, "create");
	Balanced.TEST.bankAccountTokenizingStub.callsArgWith(1, {
		status: 201,
		data: {
			uri: "/v1/bank_accounts/deadbeef"
		}
	});

	visit(customerRoute)
		.click('.bank-account-info a.add')
		.fillIn('#add-bank-account .modal-body input[name="name"]', 'TEST')
		.fillIn('#add-bank-account .modal-body input[name="account_number"]', '123')
		.fillIn('#add-bank-account .modal-body input[name="routing_number"]', '123123123')
		.click('#add-bank-account .modal-body input[name="account_type"][value="checking"]')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(Balanced.TEST.bankAccountTokenizingStub.calledOnce);
			assert.ok(Balanced.TEST.bankAccountTokenizingStub.calledWith({
				type: "checking",
				name: "TEST",
				account_number: "123",
				routing_number: "123123123"
			}));
			assert.ok(createSpy.calledOnce);
			assert.ok(createSpy.calledWith(Balanced.BankAccount, '/v1/customers/' + Balanced.TEST.CUSTOMER_ID + '/bank_accounts', sinon.match({
				bank_account_uri: '/v1/bank_accounts/deadbeef'
			})));
		});
});

test('can add card', function(assert) {
	var createSpy = sinon.spy(Balanced.Adapter, "create");
	Balanced.TEST.cardTokenizingStub.callsArgWith(1, {
		status: 201,
		data: {
			uri: "/v1/cards/deadbeef"
		}
	});

	visit(customerRoute)
		.click('.card-info a.add')
		.fillIn('#add-card .modal-body input[name="name"]', 'TEST')
		.fillIn('#add-card .modal-body input[name="card_number"]', '4111111111111111')
		.fillIn('#add-card .modal-body input[name="security_code"]', '123')
		.fillIn('#add-card .modal-body select[name="expiration_month"]', '1')
		.fillIn('#add-card .modal-body select[name="expiration_year"]', '2020')
		.click('#add-card .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(Balanced.TEST.cardTokenizingStub.calledOnce);

			assert.ok(Balanced.TEST.cardTokenizingStub.calledWith({
				card_number: "4111111111111111",
				expiration_month: 1,
				expiration_year: 2020,
				security_code: "123",
				name: "TEST",
				postal_code: ""
			}));

			assert.ok(createSpy.calledOnce);
			assert.ok(createSpy.calledWith(Balanced.Card, '/v1/customers/' + Balanced.TEST.CUSTOMER_ID + '/cards', sinon.match({
				card_uri: '/v1/cards/deadbeef'
			})));
		});
});

test('can add card with postal code', function(assert) {
	var createSpy = sinon.spy(Balanced.Adapter, "create");
	Balanced.TEST.cardTokenizingStub.callsArgWith(1, {
		status: 201,
		data: {
			uri: "/v1/cards/deadbeef"
		}
	});

	visit(customerRoute)
		.click('.card-info a.add')
		.fillIn('#add-card .modal-body input[name="name"]', 'TEST')
		.fillIn('#add-card .modal-body input[name="card_number"]', '4111111111111111')
		.fillIn('#add-card .modal-body input[name="security_code"]', '123')
		.fillIn('#add-card .modal-body select[name="expiration_month"]', '1')
		.fillIn('#add-card .modal-body select[name="expiration_year"]', '2020')
		.fillIn('#add-card .modal-body input[name="postal_code"]', '94612')
		.click('#add-card .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(Balanced.TEST.cardTokenizingStub.calledOnce);

			assert.ok(Balanced.TEST.cardTokenizingStub.calledWith({
				card_number: "4111111111111111",
				expiration_month: 1,
				expiration_year: 2020,
				security_code: "123",
				name: "TEST",
				postal_code: "94612"
			}));

			assert.ok(createSpy.calledOnce);
			assert.ok(createSpy.calledWith(Balanced.Card, '/v1/customers/' + Balanced.TEST.CUSTOMER_ID + '/cards', sinon.match({
				card_uri: '/v1/cards/deadbeef'
			})));
		});
});
