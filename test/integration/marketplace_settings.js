module('Marketplace Settings', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createBankAccount();
		Testing.createCard();
		Ember.run(function() {
			Balanced.Callback.create({
				uri: '/callbacks',
				url: 'http://api.com/something',
				revision: '1.0'
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
	visit(Testing.SETTINGS_ROUTE)
		.then(function() {
			var $title = $('#content h1');
			assert.notEqual($title.text().indexOf('Settings'), -1, 'Title is not correct');
		});
});

test('can update marketplace info', function(assert) {
	visit(Testing.SETTINGS_ROUTE).then(function() {
		var model = Balanced.__container__.lookup('controller:marketplaceSettings').get('model');
		model.set('production', true);
		stop();

		Ember.run.next(function() {
			start();
			click('.marketplace-info a.edit')
				.fillIn('#edit-marketplace-info .modal-body input[name="name"]', 'Test')
				.click('#edit-marketplace-info .modal-footer button[name="modal-submit"]')
				.then(function() {
					// Marketplace name should have changed
					assert.equal($('.marketplace-info div.control-group:nth-child(2) .inline-label').text().trim(), 'Test');
				});
		});
	});
});

test('updating marketplace info only submits once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "update");

	visit(Testing.SETTINGS_ROUTE).then(function() {
		var model = Balanced.__container__.lookup('controller:marketplaceSettings').get('model');
		model.set('production', true);
		stop();

		Ember.run.next(function() {
			start();
			click('.marketplace-info a.edit')
				.fillIn('#edit-marketplace-info .modal-body input[name="name"]', 'Test')
				.click('#edit-marketplace-info .modal-footer button[name="modal-submit"]')
				.click('#edit-marketplace-info .modal-footer button[name="modal-submit"]')
				.click('#edit-marketplace-info .modal-footer button[name="modal-submit"]')
				.then(function() {
					assert.ok(stub.calledOnce);
				});
		});
	});
});

test('can update owner info', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "update");

	visit(Testing.SETTINGS_ROUTE).then(function() {
		var model = Balanced.__container__.lookup('controller:marketplaceSettings').get('model');
		model.set('owner_customer', Balanced.Customer.create());
		model.set('production', true);
		stop();

		Ember.run.next(function() {
			start();
			click('.owner-info a.edit')
				.fillIn('#edit-customer-info .modal-body input[name="name"]', 'TEST')
				.fillIn('#edit-customer-info .modal-body input[name="email"]', 'TEST@example.com')
				.fillIn('#edit-customer-info .modal-body input[name="business_name"]', 'TEST')
				.fillIn('#edit-customer-info .modal-body input[name="ein"]', '1234')
				.click('#edit-customer-info a.more-info')
				.fillIn('#edit-customer-info .modal-body input[name="line1"]', '600 William St')
				.fillIn('#edit-customer-info .modal-body input[name="line2"]', 'Apt 400')
				.fillIn('#edit-customer-info .modal-body input[name="city"]', 'Oakland')
				.fillIn('#edit-customer-info .modal-body input[name="state"]', 'CA')
				.fillIn('#edit-customer-info .modal-body select[name="country_code"]', 'US')
				.fillIn('#edit-customer-info .modal-body input[name="postal_code"]', '12345')
				.fillIn('#edit-customer-info .modal-body input[name="phone"]', '1231231234')
				.fillIn('#edit-customer-info .modal-body input[name="dob_month"]', '12')
				.fillIn('#edit-customer-info .modal-body input[name="dob_year"]', '1924')
				.fillIn('#edit-customer-info .modal-body input[name="ssn_last4"]', '1234')
				.click('#edit-customer-info .modal-footer button[name="modal-submit"]')
				.then(function() {
					assert.ok(stub.calledOnce);
					assert.ok(stub.calledWith(Balanced.Customer));
					assert.equal(stub.getCall(0).args[2].name, "TEST");
					assert.equal(stub.getCall(0).args[2].email, "TEST@example.com");
					assert.equal(stub.getCall(0).args[2].business_name, "TEST");
					assert.equal(stub.getCall(0).args[2].ein, "1234");
					assert.equal(stub.getCall(0).args[2].address.line1, "600 William St");
					assert.equal(stub.getCall(0).args[2].address.line2, "Apt 400");
					assert.equal(stub.getCall(0).args[2].address.city, "Oakland");
					assert.equal(stub.getCall(0).args[2].address.state, "CA");
					assert.equal(stub.getCall(0).args[2].address.country_code, "US");
					assert.equal(stub.getCall(0).args[2].address.postal_code, "12345");
					assert.equal(stub.getCall(0).args[2].phone, "1231231234");
					assert.equal(stub.getCall(0).args[2].dob_month, "12");
					assert.equal(stub.getCall(0).args[2].dob_year, "1924");
					assert.equal(stub.getCall(0).args[2].ssn_last4, "1234");
				});
		});
	});
});

test('can create checking accounts', function(assert) {
	//var createSpy = sinon.spy(Balanced.Adapter, "create");
	var tokenizingStub = sinon.stub(balanced.bankAccount, "create");
	tokenizingStub.callsArgWith(1, {
		status: 201,
		bank_accounts: [{
			href: '/bank_accounts/' + Testing.BANK_ACCOUNT_ID
		}]
	});

	visit(Testing.SETTINGS_ROUTE)
		.click('.bank-account-info a.add')
		.fillIn('#add-bank-account .modal-body input[name="name"]', 'TEST')
		.fillIn('#add-bank-account .modal-body input[name="account_number"]', '123')
		.fillIn('#add-bank-account .modal-body input[name="routing_number"]', '123123123')
		.click('#add-bank-account .modal-body input[name="account_type"][value="checking"]')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			// test balanced.js
			assert.ok(tokenizingStub.calledOnce);
			assert.ok(tokenizingStub.calledWith({
				type: "checking",
				name: "TEST",
				account_number: "123",
				routing_number: "123123123"
			}));
			balanced.bankAccount.create.restore();
			/*
			assert.ok(createSpy.calledOnce);
			assert.ok(createSpy.calledWith(Balanced.BankAccount, '/v1/customers/' + Testing.CUSTOMER_ID + '/bank_accounts', {
				bank_account_uri: '/v1/bank_accounts/deadbeef'
			}));
			*/
		});
});

test('can fail at creating bank accounts', function(assert) {
	var tokenizingStub = sinon.stub(balanced.bankAccount, "create");
	tokenizingStub.callsArgWith(1, {
		status: 400,
		errors: [{
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
		}]
	});

	visit(Testing.SETTINGS_ROUTE)
		.click('.bank-account-info a.add')
		.fillIn('#add-bank-account .modal-body input[name="name"]', 'TEST')
		.fillIn('#add-bank-account .modal-body input[name="account_number"]', '123')
		.fillIn('#add-bank-account .modal-body input[name="routing_number"]', '123123123abc')
		.click('#add-bank-account .modal-body input[name="account_type"][value="checking"]')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(tokenizingStub.calledOnce);
			assert.ok(tokenizingStub.calledWith({
				type: "checking",
				name: "TEST",
				account_number: "123",
				routing_number: "123123123abc"
			}));

			balanced.bankAccount.create.restore();

			assert.ok($('#add-bank-account .modal-body input[name="routing_number"]').closest('.control-group').hasClass('error'), 'Validation errors being reported');
			assert.equal($('#add-bank-account .modal-body input[name="routing_number"]').next().text().trim(), '"321171184abc" must have length <= 9');
		});
});

test('can create savings accounts', function(assert) {
	//var createSpy = sinon.spy(Balanced.Adapter, "create");
	var tokenizingStub = sinon.stub(balanced.bankAccount, "create");
	tokenizingStub.callsArgWith(1, {
		status: 201,
		bank_accounts: [{
			href: '/bank_accounts/' + Testing.BANK_ACCOUNT_ID
		}]
	});

	visit(Testing.SETTINGS_ROUTE)
		.click('.bank-account-info a.add')
		.fillIn('#add-bank-account .modal-body input[name="name"]', 'TEST')
		.fillIn('#add-bank-account .modal-body input[name="account_number"]', '123')
		.fillIn('#add-bank-account .modal-body input[name="routing_number"]', '123123123')
		.click('#add-bank-account .modal-body input[name="account_type"][value="savings"]')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			// test balanced.js
			assert.ok(tokenizingStub.calledOnce);
			assert.ok(tokenizingStub.calledWith({
				type: "savings",
				name: "TEST",
				account_number: "123",
				routing_number: "123123123"
			}));
			balanced.bankAccount.create.restore();
			/*
			assert.ok(createSpy.calledOnce);
			assert.ok(createSpy.calledWith(Balanced.BankAccount, '/v1/customers/' + Testing.CUSTOMER_ID + '/bank_accounts', {
				bank_account_uri: '/v1/bank_accounts/deadbeef'
			}));
			*/
		});
});

test('create bank account only submits once when clicked multiple times', function(assert) {
	var spy = sinon.spy(balanced.bankAccount, 'create');
	var model;

	visit(Testing.SETTINGS_ROUTE)
		.click('.bank-account-info a.add')
		.fillIn('#add-bank-account .modal-body input[name="name"]', 'TEST')
		.fillIn('#add-bank-account .modal-body input[name="account_number"]', '123')
		.fillIn('#add-bank-account .modal-body input[name="routing_number"]', '123123123')
		.click('#add-bank-account .modal-body input[name="account_type"][value="checking"]')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			balanced.bankAccount.create.restore();
		});
});

test('can delete bank accounts', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "delete");
	var initialLength;
	var bankAccounts = Balanced.BankAccount.findAll();
	var model;

	visit(Testing.SETTINGS_ROUTE)
		.then(function() {
			/**
			 * WORKAROUND: I think there may be something weird happening
			 * with the custom models when it is in synchronous mode.
			 */
			model = Balanced.__container__.lookup('controller:marketplaceSettings').get('model');
			model.set('owner_customer', Ember.Object.create());
			model.set('owner_customer.bank_accounts', bankAccounts);
			stop();

			Ember.run.next(function() {
				start();
				initialLength = $('.bank-account-info .sidebar-items li').length;

				click(".bank-account-info .sidebar-items li:eq(0) .icon-delete")
					.click('#delete-bank-account .modal-footer button[name="modal-submit"]')
					.then(function() {
						/**
						 * WORKAROUND: since the test runner is synchronous,
						 * lets force the model into a saving state.
						 */
						bankAccounts.get('content').forEach(function(bankAccount) {
							bankAccount.set('isSaving', true);
						});

						stop();
						Ember.run.next(function() {
							start();
							click('#delete-bank-account .modal-footer button[name="modal-submit"]');
						});
					})
					.then(function() {
						assert.equal($('.bank-account-info .sidebar-items li').length, initialLength - 1);
						assert.ok(spy.calledOnce, "Delete should have been called once");
					});
			});
		});
});

test('can create cards', function(assert) {
	//var createSpy = sinon.spy(Balanced.Adapter, "create");
	var tokenizingStub = sinon.stub(balanced.card, "create");
	tokenizingStub.callsArgWith(1, {
		status: 201,
		cards: [{
			href: '/cards/' + Testing.CARD_ID
		}]
	});
	var model;

	visit(Testing.SETTINGS_ROUTE)
		.click('.card-info a.add')
		.fillIn('#add-card .modal-body input[name="name"]', 'TEST')
		.fillIn('#add-card .modal-body input[name="number"]', '1234123412341234')
		.fillIn('#add-card .modal-body input[name="security_code"]', '123')
		.then(function() {
			$('#add-card .modal-body select[name="expiration_month"]').val('1').change();
			$('#add-card .modal-body select[name="expiration_year"]').val('2020').change();
		})
		.click('#add-card .modal-footer button[name="modal-submit"]')
		.then(function() {
			/**
			 * WORKAROUND: since the test runner is synchronous,
			 * lets force the model into a saving state.
			 */
			model = Balanced.__container__.lookup('controller:marketplaceSettings').get('model');
			model.set('isSaving', true);

			stop();
			Ember.run.next(function() {
				start();
				click('#add-card .modal-footer button[name="modal-submit"]');
			});
		})
		.then(function() {
			assert.ok(tokenizingStub.calledWith(sinon.match({
				name: "TEST",
				number: "1234123412341234",
				cvv: "123",
				expiration_month: 1,
				expiration_year: 2020,
				postal_code: ""
			})));
			assert.ok(tokenizingStub.calledOnce);
			/*assert.ok(createSpy.calledOnce);
			assert.ok(createSpy.calledWith(Balanced.Card, '/v1/customers/' + Testing.CUSTOMER_ID + '/cards', {
				card_uri: '/v1/cards/deadbeef'
			}));*/
			balanced.card.create.restore();
		});
});

test('can delete cards', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "delete");
	var cards = Balanced.Card.findAll();
	var model;

	visit(Testing.SETTINGS_ROUTE)
		.then(function() {
			/**
			 * WORKAROUND: I think there may be something weird happening
			 * with the custom models when it is in synchronous mode.
			 */
			model = Balanced.__container__.lookup('controller:marketplaceSettings').get('model');
			model.set('owner_customer', Ember.Object.create());
			model.set('owner_customer.cards', cards);
			stop();

			Ember.run.next(function() {
				start();
				assert.equal($('.card-info .sidebar-items li').length, 1);

				click(".card-info .sidebar-items li:eq(0) .icon-delete")
					.click('#delete-card .modal-footer button[name="modal-submit"]')
					.then(function() {
						/**
						 * WORKAROUND: since the test runner is synchronous,
						 * lets force the model into a saving state.
						 */
						model.set('isSaving', true);
						stop();

						Ember.run.next(function() {
							start();
							click('#delete-card .modal-footer button[name="modal-submit"]');
						});
					})
					.then(function() {
						assert.equal($('.card-info .sidebar-items li').length, 0);
						assert.ok(spy.calledOnce, "Delete should have been called once");
					});
			});
		});
});

test('shows webhooks', function(assert) {
	visit(Testing.SETTINGS_ROUTE)
		.then(function() {
			assert.equal($('ul.webhooks li').length, 1);
		});
});

test('can add webhooks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.SETTINGS_ROUTE)
		.click(".webhook-info .add")
		.fillIn("#add-callback .modal-body input[name='url']", 'http://www.example.com/something')
		.fillIn("#add-callback .modal-body select[name='callback-revision']", '1.0')
		.click('#add-callback .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.equal(stub.getCall(0).args[2].revision, '1.0');
			assert.equal(stub.getCall(0).args[2].url, 'http://www.example.com/something');
		});
});

test('webhooks get created once if submit button is clicked multiple times', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.SETTINGS_ROUTE)
		.click(".webhook-info .add")
		.fillIn("#add-callback .modal-body input[name='url']", 'http://www.example.com/something')
		.fillIn("#add-callback .modal-body select[name='callback-revision']", '1.1')
		.click('#add-callback .modal-footer button[name="modal-submit"]')
		.click('#add-callback .modal-footer button[name="modal-submit"]')
		.click('#add-callback .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.equal(stub.getCall(0).args[2].revision, '1.1');
			assert.equal(stub.getCall(0).args[2].url, 'http://www.example.com/something');
		});
});

test('can delete webhooks', function(assert) {
	visit(Testing.SETTINGS_ROUTE)
		.click('ul.webhooks li:eq(0) a')
		.click('#delete-callback .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.equal($('ul.webhooks li').length, 0);
		});
});

test('delete webhooks only submits once even if clicked multiple times', function(assert) {
	var spy = sinon.stub(Balanced.Adapter, "delete");

	visit(Testing.SETTINGS_ROUTE)
		.click('ul.webhooks li:eq(0) a')
		.click('#delete-callback .modal-footer button[name="modal-submit"]')
		.click('#delete-callback .modal-footer button[name="modal-submit"]')
		.click('#delete-callback .modal-footer button[name="modal-submit"]')
		.click('#delete-callback .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
		});
});
