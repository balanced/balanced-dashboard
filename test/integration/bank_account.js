module('Bank Account Page', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createBankAccount();
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter.create
		);
	}
});

var setBankAccountProperties = function(properties) {
	Ember.run(function() {
		Balanced.__container__.lookup('controller:bankAccounts')
			.get('model').setProperties(properties);
	});
};

test('can view bank account page', function(assert) {
	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			var h1Text = $("#content h1").text().trim().replace(/\s+/gm, " ");
			assert.deepEqual(h1Text, "Checking account 1234 Wells Fargo Bank");
		});
});

test('credit bank account', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.click(".page-navigation a.credit-button")
		.then(function() {
			// opened the modal
			assert.equal(
				$('label.control-label:contains(characters max):visible').text(),
				'Appears on statement as (14 characters max)'
			);
			assert.equal(
				$('input[name="appears_on_statement_as"]:visible').attr('maxlength'),
				'14'
			);
		})
		.fillIn('#credit-funding-instrument .modal-body input[name="dollar_amount"]', '1000')
		.fillIn('#credit-funding-instrument .modal-body input[name="description"]', 'Test credit')
		.click('#credit-funding-instrument .modal-footer button[name="modal-submit"]')
		.then(function() {
			// should be one create for the debit
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.Credit, '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/credits', sinon.match({
				amount: 100000,
				description: "Test credit"
			})));
		});
});

test('crediting only submits once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.click(".page-navigation a.credit-button")
		.fillIn('#credit-funding-instrument .modal-body input[name="dollar_amount"]', '1000')
		.fillIn('#credit-funding-instrument .modal-body input[name="description"]', 'Test credit')
		.click('#credit-funding-instrument .modal-footer button[name="modal-submit"]')
		.click('#credit-funding-instrument .modal-footer button[name="modal-submit"]')
		.click('#credit-funding-instrument .modal-footer button[name="modal-submit"]')
		.click('#credit-funding-instrument .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});

test('debit bank account', 4, function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			setBankAccountProperties({
				can_debit: true
			});
		})
		.click(".page-navigation a.debit-button")
		.then(function() {
			// opened the modal
			assert.equal(
				$('label.control-label:contains(characters max):visible').text(),
				'Appears on statement as (14 characters max)'
			);
			assert.equal(
				$('input[name="appears_on_statement_as"]:visible').attr('maxlength'),
				'14'
			);
		})
		.fillForm("#debit-funding-instrument", {
			dollar_amount: '1000',
			description: 'Test debit'
		})
		.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.Debit, '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/debits', sinon.match({
				amount: 100000,
				description: "Test debit"
			})));
		});
});

test('debiting only submits once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			setBankAccountProperties({
				can_debit: true
			});
		})
		.click(".page-navigation a.debit-button")
		.fillForm("#debit-funding-instrument", {
			dollar_amount: '1000',
			description: 'Test debit'
		})
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

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			setBankAccountProperties({
				can_debit: false,
				customer: true,
				verification: false
			});
		})
		.checkElements({
			".page-navigation a.verify-button": 1,
		}, assert)
		.click(".page-navigation a.verify-button")
		.then(function() {
			assert.ok($('#verify-bank-account:visible'), 'verify bank account modal visible');
		})
		.click('#verify-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.Verification, '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/verifications'));
		});
});

test('can confirm bank account verification', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			setBankAccountProperties({
				can_debit: false,
				verification: Balanced.Verification.create({
					uri: '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/bank_account_verifications',
					verification_status: 'pending',
					attempts_remaining: 1
				})
			});
		})
		.checkElements({
			".page-navigation a.confirm-verification-button": 1,
		}, assert)
		.click(".page-navigation a.confirm-verification-button")
		.then(function() {
			assert.equal($('#confirm-verification').css('display'), 'block', 'confirm verification modal visible');
		})
		.fillForm("#confirm-verification", {
			amount_1: "1.00",
			amount_2: "1.00"
		})
		.click('#confirm-verification .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.Verification, '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/bank_account_verifications'));
			assert.ok(stub.getCall(0).args[2].amount_1, "1.00");
			assert.ok(stub.getCall(0).args[2].amount_2, "1.00");
		});
});

test('renders metadata correctly', function(assert) {
	var metaData = {
		'key': 'value',
		'other-keey': 'other-vaalue'
	};
	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			var controller = Balanced.__container__.lookup("controller:bank_accounts");
			Ember.run(function() {
				controller.get("model").set("meta", metaData);
			});
		})
		.checkElements({
			".dl-horizontal dt:contains(key)": 1,
			".dl-horizontal dd:contains(value)": 1,

			".dl-horizontal dt:contains(other-keey)": 1,
			".dl-horizontal dd:contains(other-vaalue)": 1,
		}, assert);
});
