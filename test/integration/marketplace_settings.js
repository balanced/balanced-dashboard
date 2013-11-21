var settingsRoute;

module('Marketplace Settings', {
	setup: function() {
		Balanced.TEST.setupMarketplace(true);
		settingsRoute = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID + '/settings';
		Ember.run(function() {
			Balanced.Card.create({
				uri: '/v1/marketplaces/' + Balanced.TEST.MARKETPLACE_ID + '/cards',
				card_number: '4444400012123434',
				name: 'Test Card',
				expiration_year: 2020,
				expiration_month: 11
			}).save().then(function(card) {
				var uri = card.uri;
				// ghetto workaround
				Balanced.NET.ajax({
					url: ENV.BALANCED.API + Balanced.TEST.marketplace.get('owner_customer.uri'),
					type: 'put',
					data: {
						card_uri: uri
					}
				});
			});
			Balanced.Callback.create({
				uri: '/v1/marketplaces/' + Balanced.TEST.MARKETPLACE_ID + '/callbacks',
				url: 'http://api.com/something'
			}).save();
		});
	},
	teardown: function() {
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

test('can visit page', function(assert) {
	visit(settingsRoute)
		.then(function() {
			var $title = $('#content h1');
			assert.notEqual($title.text().indexOf('Settings'), -1, 'Title is not correct');
		});
});

test('can update marketplace info', function(assert) {
	visit(settingsRoute)
		.click('.marketplace-info a.edit')
		.fillIn('#edit-marketplace-info .modal-body input[name="name"]', 'Test')
		.click('#edit-marketplace-info .modal-footer button[name="modal-submit"]')
		.then(function() {
			// Marketplace name should have changed
			assert.equal($('.marketplace-info div.control-group:nth-child(2) .inline-label').text().trim(), 'Test');
		});
});

test('updating marketplace info only submits once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "update");

	visit(settingsRoute)
		.click('.marketplace-info a.edit')
		.fillIn('#edit-marketplace-info .modal-body input[name="name"]', 'Test')
		.click('#edit-marketplace-info .modal-footer button[name="modal-submit"]')
		.click('#edit-marketplace-info .modal-footer button[name="modal-submit"]')
		.click('#edit-marketplace-info .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});

test('can update owner info', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(settingsRoute)
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

test('can create bank accounts', function(assert) {
	var createSpy = sinon.spy(Balanced.Adapter, "create");
	Balanced.TEST.bankAccountTokenizingStub.callsArgWith(1, {
		status: 201,
		data: {
			uri: "/v1/bank_accounts/deadbeef"
		}
	});

	visit(settingsRoute)
		.then(function() {
			// Bank accounts added to the fixture, used for add and withdraw funds
			assert.equal($('.bank-account-info .sidebar-items li').length, 1);
		})
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
			assert.ok(createSpy.calledWith(Balanced.BankAccount, '/v1/customers/' + Balanced.TEST.CUSTOMER_ID + '/bank_accounts', {
				bank_account_uri: '/v1/bank_accounts/deadbeef'
			}));
		});
});

test('can fail at creating bank accounts', function(assert) {
	var createSpy = sinon.spy(Balanced.Adapter, "create");
	Balanced.TEST.bankAccountTokenizingStub.callsArgWith(1, {
		status: 400,
		error: {
			"status": "Bad Request",
			"category_code": "request",
			"additional": null,
			"status_code": 400,
			"description": "Invalid field [routing_number] - \"321171184abc\" must have length <= 9 Your request id is OHM4b90b4d8524611e3b62e02a1fe52a36c.",
			"category_type": "request",
			"_uris": {},
			"request_id": "OHM4b90b4d8524611e3b62e02a1fe52a36c",
			"extras": {
				"routing_number": "\"321171184abc\" must have length <= 9"
			}
		}
	});

	visit(settingsRoute)
		.then(function() {
			// Bank accounts added to the fixture, used for add and withdraw funds
			assert.equal($('.bank-account-info .sidebar-items li').length, 1);
		})
		.click('.bank-account-info a.add')
		.fillIn('#add-bank-account .modal-body input[name="name"]', 'TEST')
		.fillIn('#add-bank-account .modal-body input[name="account_number"]', '123')
		.fillIn('#add-bank-account .modal-body input[name="routing_number"]', '123123123abc')
		.click('#add-bank-account .modal-body input[name="account_type"][value="checking"]')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(Balanced.TEST.bankAccountTokenizingStub.calledOnce);
			assert.ok(Balanced.TEST.bankAccountTokenizingStub.calledWith({
				type: "checking",
				name: "TEST",
				account_number: "123",
				routing_number: "123123123abc"
			}));
			assert.ok($('#add-bank-account .modal-body input[name="routing_number"]').closest('.control-group').hasClass('error'), 'Validation errors being reported');
		});
});

test('can create savings accounts', function(assert) {
	var createSpy = sinon.spy(Balanced.Adapter, "create");
	Balanced.TEST.bankAccountTokenizingStub.callsArgWith(1, {
		status: 201,
		data: {
			uri: "/v1/bank_accounts/deadbeef"
		}
	});

	visit(settingsRoute)
		.click('.bank-account-info a.add')
		.fillIn('#add-bank-account .modal-body input[name="name"]', 'TEST')
		.fillIn('#add-bank-account .modal-body input[name="account_number"]', '123')
		.fillIn('#add-bank-account .modal-body input[name="routing_number"]', '123123123')
		.click('#add-bank-account .modal-body input[name="account_type"][value="savings"]')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(Balanced.TEST.bankAccountTokenizingStub.calledOnce);

			// phantomjs can't handle the change events, so can't check the payload for now
			// TODO - put this back in when we're off phantomjs
			// assert.ok(Balanced.TEST.bankAccountTokenizingStub.calledWith({
			//     type: "savings",
			//     name: "TEST",
			//     account_number: "123",
			//     routing_number: "123123123"
			// }));

			assert.ok(createSpy.calledOnce);
			assert.ok(createSpy.calledWith(Balanced.BankAccount, '/v1/customers/' + Balanced.TEST.CUSTOMER_ID + '/bank_accounts', {
				bank_account_uri: '/v1/bank_accounts/deadbeef'
			}));
		});
});

test('create bank account only submits once when clicked multiple times', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");
	Balanced.TEST.bankAccountTokenizingStub.callsArgWith(1, {
		status: 201,
		data: {
			uri: "/v1/bank_accounts/deadbeef"
		}
	});

	visit(settingsRoute)
		.then(function() {
			// Bank accounts added to the fixture, used for add and withdraw funds
			assert.equal($('.bank-account-info .sidebar-items li').length, 1);
		})
		.click('.bank-account-info a.add')
		.fillIn('#add-bank-account .modal-body input[name="name"]', 'TEST')
		.fillIn('#add-bank-account .modal-body input[name="account_number"]', '123')
		.fillIn('#add-bank-account .modal-body input[name="routing_number"]', '123123123')
		.click('#add-bank-account .modal-body input[name="account_type"][value="checking"]')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(Balanced.TEST.bankAccountTokenizingStub.calledOnce);
			assert.ok(stub.calledOnce);
		});
});

test('can delete bank accounts', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "delete");
	var initialLength;

	visit(settingsRoute)
		.then(function() {
			initialLength = $('.bank-account-info .sidebar-items li').length;
		})
		.click(".bank-account-info .sidebar-items li:eq(0) .icon-delete")
		.click('#delete-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.equal($('.bank-account-info .sidebar-items li').length, initialLength - 1);
			assert.ok(spy.calledOnce, "Delete should have been called once");
		});
});

test('delete bank accounts only deletes once when submit clicked multiple times', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "delete");

	visit(settingsRoute)
		.click(".bank-account-info .sidebar-items li:eq(0) .icon-delete")
		.click('#delete-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce, "Delete should have been called once");
		});
});

test('can create cards', function(assert) {
	var createSpy = sinon.spy(Balanced.Adapter, "create");
	Balanced.TEST.cardTokenizingStub.callsArgWith(1, {
		status: 201,
		data: {
			uri: "/v1/cards/deadbeef"
		}
	});

	visit(settingsRoute)
		.click('.card-info a.add')
		.fillIn('#add-card .modal-body input[name="name"]', 'TEST')
		.fillIn('#add-card .modal-body input[name="card_number"]', '1234123412341234')
		.fillIn('#add-card .modal-body input[name="security_code"]', '123')
		.then(function() {
			$('#add-card .modal-body select[name="expiration_month"] option[value="1"]').attr('selected', 'selected');
			$('#add-card .modal-body select[name="expiration_month"]').trigger('change');
			$('#add-card .modal-body select[name="expiration_year"] option[value="2020"]').attr('selected', 'selected');
			$('#add-card .modal-body select[name="expiration_year"]').trigger('change');
		})
		.click('#add-card .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(Balanced.TEST.cardTokenizingStub.calledOnce);
			assert.ok(createSpy.calledOnce);
			assert.ok(createSpy.calledWith(Balanced.Card, '/v1/customers/' + Balanced.TEST.CUSTOMER_ID + '/cards', {
				card_uri: '/v1/cards/deadbeef'
			}));
		});

	// phantomjs can't handle the change events, so can't check the payload for now
	// TODO - put this back in when we're off phantomjs
	// assert.ok(Balanced.TEST.cardTokenizingStub.calledWith({
	//     card_number: "1234123412341234",
	//     expiration_month: 1,
	//     expiration_year: 2020,
	//     security_code: "123",
	//     name: "TEST",
	//     postal_code: ""
	// }));
});

test('create card only submits once when clicked multiple times', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");
	Balanced.TEST.cardTokenizingStub.callsArgWith(1, {
		status: 201,
		data: {
			uri: "/v1/cards/deadbeef"
		}
	});

	visit(settingsRoute)
		.click('.card-info a.add')
		.fillIn('#add-card .modal-body input[name="name"]', 'TEST')
		.fillIn('#add-card .modal-body input[name="card_number"]', '1234123412341234')
		.fillIn('#add-card .modal-body input[name="security_code"]', '123')
		.then(function() {
			$('#add-card .modal-body select[name="expiration_month"] option[value="1"]').attr('selected', 'selected');
			$('#add-card .modal-body select[name="expiration_month"]').trigger('change');
			$('#add-card .modal-body select[name="expiration_year"] option[value="2020"]').attr('selected', 'selected');
			$('#add-card .modal-body select[name="expiration_year"]').trigger('change');
		})
		.click('#add-card .modal-footer button[name="modal-submit"]')
		.click('#add-card .modal-footer button[name="modal-submit"]')
		.click('#add-card .modal-footer button[name="modal-submit"]')
		.click('#add-card .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(Balanced.TEST.cardTokenizingStub.calledOnce);
			assert.ok(stub.calledOnce);
		});
});

test('can delete cards', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "delete");

	visit(settingsRoute)
		.then(function() {
			assert.equal($('.card-info .sidebar-items li').length, 1);
		})
		.click(".card-info .sidebar-items li:eq(0) .icon-delete")
		.click('#delete-card .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.equal($('.card-info .sidebar-items li').length, 0);
			assert.ok(spy.calledOnce, "Delete should have been called once");
		});

	//  TODO: assert server side call was made once.
});

test('delete cards only deletes once when submit clicked multiple times', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "delete");

	visit(settingsRoute)
		.click(".card-info .sidebar-items li:eq(0) .icon-delete")
		.click('#delete-card .modal-footer button[name="modal-submit"]')
		.click('#delete-card .modal-footer button[name="modal-submit"]')
		.click('#delete-card .modal-footer button[name="modal-submit"]')
		.click('#delete-card .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce, "Delete should have been called once");
		});
	//  TODO: assert server side call was made once.
});

test('shows webhooks', function(assert) {
	visit(settingsRoute)
		.then(function() {
			assert.equal($('ul.webhooks li').length, 1);
		});
});

test('can add webhooks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(settingsRoute)
		.click(".webhook-info .add")
		.fillIn("#add-callback .modal-body input[name='url']", 'http://www.example.com/something')
		.click('#add-callback .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});

test('webhooks get created once if submit button is clicked multiple times', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(settingsRoute)
		.click(".webhook-info .add")
		.fillIn("#add-callback .modal-body input[name='url']", 'http://www.example.com/something')
		.click('#add-callback .modal-footer button[name="modal-submit"]')
		.click('#add-callback .modal-footer button[name="modal-submit"]')
		.click('#add-callback .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});

test('can delete webhooks', function(assert) {
	visit(settingsRoute)
		.click('ul.webhooks li:eq(0) a')
		.click('#delete-callback .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.equal($('ul.webhooks li').length, 0);
		});
});

test('delete webhooks only submits once even if clicked multiple times', function(assert) {
	var spy = sinon.stub(Balanced.Adapter, "delete");

	visit(settingsRoute)
		.click('ul.webhooks li:eq(0) a')
		.click('#delete-callback .modal-footer button[name="modal-submit"]')
		.click('#delete-callback .modal-footer button[name="modal-submit"]')
		.click('#delete-callback .modal-footer button[name="modal-submit"]')
		.click('#delete-callback .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
		});
});
