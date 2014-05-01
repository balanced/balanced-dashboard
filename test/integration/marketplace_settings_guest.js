module('Marketplace Settings Guest', {
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
		$(".modal").modal('hide');
	}
});

test('can visit page', function(assert) {
	visit(Testing.SETTINGS_ROUTE)
		.then(function() {
			var $title = $('#content h1');
			assert.notEqual($title.text().indexOf('Settings'), -1, 'Title is not correct');

			var $dropdown = $('#user-menu > a.dropdown-toggle.gravatar');
			assert.equal($dropdown.text().trim().length, 0, 'No Email is shown');

			assert.equal($('.notification-center-message').length, 1, 'Has Notification');
		});
});

test('can manage api keys', function(assert) {
	visit(Testing.SETTINGS_ROUTE)
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name="modal-submit"]')
		.then(function() {
			assert.ok($('.api-keys-info tr').length > 1, 'API Key can be created');
		})
		.click('.confirm-delete-key:first')
		.then(function() {
			assert.equal($('.modal.delete-key:visible').length, 1, 'Delete Key confirmation modal should be visible');
		})
		.click('.modal.delete-key:visible button[name="modal-submit"]')
		.then(function() {
			assert.ok($('.api-keys-info tr').length === 1, 'API Key can be deleted');
		});
});

test('can add api key', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, 'create');
	visit(Testing.SETTINGS_ROUTE)
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.APIKey));
		})
		.click('.create-api-key-btn')
		.fillIn('.modal.create-api-key input.full', 'Test1234')
		.click('.modal.create-api-key button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledTwice);
			assert.ok(stub.getCall(1).calledWith(
				sinon.match.any,
				sinon.match.any,
				sinon.match.has('meta', {
					name: 'Test1234'
				})
			));
			stub.restore();
		});
});

test('adding api key updates auth', function(assert) {
	var testSecret = 'amazing-secret';
	var saveStub = sinon.stub(Balanced.APIKey.prototype, 'save');
	var stub = sinon.stub(Balanced.Adapter, 'create');
	saveStub.returns({
		then: function(callback) {
			callback(Ember.Object.create({
				secret: testSecret
			}));
		}
	});

	visit(Testing.SETTINGS_ROUTE)
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(
				Balanced.UserMarketplace,
				sinon.match.any,
				sinon.match.has('secret', testSecret)
			));
			saveStub.restore();
			stub.restore();
		});
});

test('cannot delete current api key without a replacement', function(assert) {
	visit(Testing.SETTINGS_ROUTE)
		.then(function() {
			assert.equal($('.confirm-delete-key').length, 0);
		})
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name="modal-submit"]')
		.then(function() {
			assert.equal($('.confirm-delete-key').length, 2);
		});
});

test('can delete api key', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, 'delete');
	visit(Testing.SETTINGS_ROUTE)
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name="modal-submit"]')
		.click('.confirm-delete-key:first')
		.click('.modal.delete-key button[name="modal-submit"]:visible')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.APIKey));
			stub.restore();
		});
});

test('can update marketplace info', function(assert) {
	visit(Testing.SETTINGS_ROUTE).then(function() {
		var model = Balanced.__container__.lookup('controller:marketplaceSettings').get('model');
		model.set('production', true);
		Testing.stop();

		Ember.run.next(function() {
			Testing.start();

			click('.marketplace-info a.edit')
				.fillIn('#edit-marketplace-info .modal-body input[name="name"]', 'Test')
				.click('#edit-marketplace-info .modal-footer button[name="modal-submit"]')
				.then(function() {
					// Marketplace name should have changed
					assert.equal($('.marketplace-info dd[data-property="marketplace-name"]').text().trim(), 'Test');
				});
		});
	});
});

test('updating marketplace info only submits once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "update");

	visit(Testing.SETTINGS_ROUTE)
		.then(function() {
			var model = Balanced.__container__.lookup('controller:marketplaceSettings').get('model');
			model.set('production', true);
			Testing.stop();

			Ember.run.next(function() {
				Testing.start();

				click('.marketplace-info a.edit')
					.fillIn('#edit-marketplace-info .modal-body input[name="name"]', 'Test')
					.click('#edit-marketplace-info .modal-footer button[name="modal-submit"]')
					.click('#edit-marketplace-info .modal-footer button[name="modal-submit"]')
					.click('#edit-marketplace-info .modal-footer button[name="modal-submit"]')
					.then(function() {
						assert.ok(stub.calledOnce);
						stub.restore();
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
		Testing.stop();

		Ember.run.next(function() {
			Testing.start();

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
					stub.restore();
				});
		});
	});
});

test('can create checking accounts', function(assert) {
	var tokenizingStub = sinon.stub(balanced.bankAccount, "create");
	tokenizingStub.callsArgWith(1, {
		status: 201,
		bank_accounts: [{
			href: '/bank_accounts/' + Testing.BANK_ACCOUNT_ID
		}]
	});

	visit(Testing.SETTINGS_ROUTE)
		.click('.bank-account-info a.add')
		.fillForm({
			name: "TEST",
			account_number: "123",
			routing_number: "123123123"
		})
		.click('#account_type_checking')
		.then(function() {
			Testing.stop();

			Ember.run.next(function() {
				Testing.start();

				click('#add-bank-account .modal-footer button[name="modal-submit"]')
					.then(function() {
						assert.ok(tokenizingStub.calledOnce);
						assert.ok(tokenizingStub.calledWith({
							account_type: "checking",
							name: "TEST",
							account_number: "123",
							routing_number: "123123123"
						}));
						tokenizingStub.restore();
					});
			});
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
		.fillForm({
			name: "TEST",
			account_number: "123",
			routing_number: "123123123abc"
		})
		.click('#account_type_checking')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(tokenizingStub.calledOnce);
			assert.ok(tokenizingStub.calledWith({
				account_type: "checking",
				name: "TEST",
				account_number: "123",
				routing_number: "123123123abc"
			}));

			assert.ok($('#add-bank-account .modal-body input[name="routing_number"]').closest('.control-group').hasClass('error'), 'Validation errors being reported');
			assert.equal($('#add-bank-account .modal-body input[name="routing_number"]').next().text().trim(), '"321171184abc" must have length <= 9');
			tokenizingStub.restore();
		});
});

test('can create savings accounts', function(assert) {
	var tokenizingSpy = sinon.stub(balanced.bankAccount, "create");

	visit(Testing.SETTINGS_ROUTE)
		.click('.bank-account-info a.add')
		.fillForm({
			name: "TEST",
			account_number: "123",
			routing_number: "123123123"
		})
		.click('#account_type_savings')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			// test balanced.js
			assert.ok(tokenizingSpy.calledOnce);
			assert.ok(tokenizingSpy.calledWith({
				account_type: "savings",
				name: "TEST",
				account_number: "123",
				routing_number: "123123123"
			}));
			tokenizingSpy.restore();
		});
});

test('create bank account only submits once when clicked multiple times', function(assert) {
	var spy = sinon.spy(balanced.bankAccount, 'create');

	visit(Testing.SETTINGS_ROUTE)
		.click('.bank-account-info a.add')
		.fillForm({
			name: "TEST",
			account_number: "123",
			routing_number: "123123123"
		})
		.click('#account_type_checking')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			spy.restore();
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
			Testing.stop();

			Ember.run.next(function() {
				Testing.start();

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

						Testing.stop();
						Ember.run.next(function() {
							Testing.start();

							click('#delete-bank-account .modal-footer button[name="modal-submit"]');
						});
					})
					.then(function() {
						assert.equal($('.bank-account-info .sidebar-items li').length, initialLength - 1);
						assert.ok(spy.calledOnce, "Delete should have been called once");
						spy.restore();
					});
			});
		});
});

test('can create cards', function(assert) {
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
		.fillForm("#add-card", {
			name: "TEST",
			number: "1234123412341234",
			security_code: "123"
		})
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

			Testing.stop();
			Ember.run.next(function() {
				Testing.start();

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
				address: {}
			})));
			assert.ok(tokenizingStub.calledOnce);
			tokenizingStub.restore();
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
			Testing.stop();

			Ember.run.next(function() {
				Testing.start();

				assert.equal($('.card-info .sidebar-items li').length, 1);

				click(".card-info .sidebar-items li:eq(0) .icon-delete")
					.click('#delete-card .modal-footer button[name="modal-submit"]')
					.then(function() {
						/**
						 * WORKAROUND: since the test runner is synchronous,
						 * lets force the model into a saving state.
						 */
						model.set('isSaving', true);
						Testing.stop();

						Ember.run.next(function() {
							Testing.start();

							click('#delete-card .modal-footer button[name="modal-submit"]');
						});
					})
					.then(function() {
						assert.equal($('.card-info .sidebar-items li').length, 0);
						assert.ok(spy.calledOnce, "Delete should have been called once");
						spy.restore();
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
			stub.restore();
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
			stub.restore();
		});
});

test('can delete webhooks', function(assert) {
	visit(Testing.SETTINGS_ROUTE)
		.click('ul.webhooks li:eq(0) a')
		.click('#delete-callback:visible .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.equal($('ul.webhooks li.no-results').length, 1);
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
			spy.restore();
		});
});
