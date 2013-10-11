var bankAccountRoute;

module('Bank Account Page', {
	setup: function() {
		Balanced.TEST.setupMarketplace();
		Ember.run(function() {
			Balanced.BankAccount.create({
				uri: '/customers/' + Balanced.TEST.CUSTOMER_ID + '/bank_accounts',
				name: 'Test Account',
				account_number: '1234',
				routing_number: '122242607',
				type: 'checking'
			}).save().then(function(bankAccount) {
				Balanced.TEST.BANK_ACCOUNT_ID = bankAccount.get('id');
				bankAccountRoute = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID +
					'/bank_accounts/' + Balanced.TEST.BANK_ACCOUNT_ID;
			});
		});
	},
	teardown: function() {}
});

test('can view bank account page', function(assert) {
	visit(bankAccountRoute)
		.then(function() {
			assert.equal($("#content h1").text().trim(), 'Bank Account');
			assert.equal($(".title span").text().trim(), 'Test Account (1234)');
		});
});

test('credit bank account', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(bankAccountRoute)
		.click(".main-header .buttons a.credit-button")
		.fillIn('#credit-bank-account .modal-body input[name="dollar_amount"]', '1000')
		.fillIn('#credit-bank-account .modal-body input[name="description"]', 'Test credit')
		.click('#credit-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			// should be one create for the debit
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.Credit, '/bank_accounts/' + Balanced.TEST.BANK_ACCOUNT_ID + '/credits', sinon.match({
				amount: 100000,
				description: "Test credit"
			})));
		});
});

test('crediting only submits once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(bankAccountRoute)
		.click(".main-header .buttons a.credit-button")
		.fillIn('#credit-bank-account .modal-body input[name="dollar_amount"]', '1000')
		.fillIn('#credit-bank-account .modal-body input[name="description"]', 'Test credit')
		.click('#credit-bank-account .modal-footer button[name="modal-submit"]')
		.click('#credit-bank-account .modal-footer button[name="modal-submit"]')
		.click('#credit-bank-account .modal-footer button[name="modal-submit"]')
		.click('#credit-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});

test('debit bank account', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(bankAccountRoute)
		.click(".main-header .buttons a.debit-button")
		.fillIn('#debit-funding-instrument .modal-body input[name="dollar_amount"]', '1000')
		.fillIn('#debit-funding-instrument .modal-body input[name="description"]', 'Test debit')
		.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.Debit, '/bank_accounts/' + Balanced.TEST.BANK_ACCOUNT_ID + '/debits', sinon.match({
				amount: 100000,
				description: "Test debit"
			})));
		});
});

test('debiting only submits once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(bankAccountRoute)
		.click(".main-header .buttons a.debit-button")
		.fillIn('#debit-funding-instrument .modal-body input[name="dollar_amount"]', '1000')
		.fillIn('#debit-funding-instrument .modal-body input[name="description"]', 'Test debit')
		.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
		.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
		.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
		.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});

test('can initiate bank account verification', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(bankAccountRoute)
		.then(function() {
			var controller = Balanced.__container__.lookup('controller:bankAccounts');
			var model = controller.get('model');
			model.set('can_debit', false);
			model.set('customer', true);
			model.set('verification', false);

			// wait for computed property to fire first
			Ember.run.next(function() {
				assert.equal($('#content h1').text().trim(), 'Bank Account');
				assert.equal($(".main-header .buttons a.verify-button").length, 1, 'has verify button');
				click(".main-header .buttons a.verify-button")
					.then(function() {
						assert.equal($('#verify-bank-account').css('display'), 'block', 'verify bank account modal visible');
					})
					.click('#verify-bank-account .modal-footer button[name="modal-submit"]')
					.then(function() {
						assert.ok(stub.calledOnce);
						assert.ok(stub.calledWith(Balanced.Verification, '/bank_accounts/' + Balanced.TEST.BANK_ACCOUNT_ID + '/bank_account_verifications'));
					});
			});
		});
});

test('can confirm bank account verification', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(bankAccountRoute)
		.then(function() {
			var controller = Balanced.__container__.lookup('controller:bankAccounts');
			var model = controller.get('model');
			model.set('can_debit', false);
			model.set('verification', Balanced.Verification.create({
				uri: '/bank_accounts/' + Balanced.TEST.BANK_ACCOUNT_ID + '/bank_account_verifications',
				verification_status: 'pending',
				attempts_remaining: 1
			}));

			// wait for computed property to fire first
			Ember.run.next(function() {
				assert.equal($('#content h1').text().trim(), 'Bank Account');
				assert.equal($(".main-header .buttons a.confirm-verification-button").length, 1, 'has confirm button');

				click(".main-header .buttons a.confirm-verification-button")
					.then(function() {
						assert.equal($('#confirm-verification').css('display'), 'block', 'confirm verification modal visible');
					})
					.fillIn('#confirm-verification .modal-body input[name="amount_1"]', '1.00')
					.fillIn('#confirm-verification .modal-body input[name="amount_2"]', '1.00')
					.click('#confirm-verification .modal-footer button[name="modal-submit"]')
					.then(function() {
						assert.ok(stub.calledOnce);
						assert.ok(stub.calledWith(Balanced.Verification, '/bank_accounts/' + Balanced.TEST.BANK_ACCOUNT_ID + '/bank_account_verifications'));
						assert.ok(stub.getCall(0).args[2].amount_1, "1.00");
						assert.ok(stub.getCall(0).args[2].amount_2, "1.00");
					});
			});
		});
});
