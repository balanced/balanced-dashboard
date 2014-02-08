module('Invoices', {
	setup: function() {
		Testing.setupFixtures();
		Testing.fixtureLogin();
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	visit('/marketplaces/TEST-MP4cOZZqeAelhxXQzljLLtgl/invoices').then(function() {
		//  check the page title has been selected
		assert.equal($('#content h1').text().trim(), 'Invoices');
	});
});

test('shows invoices list', function(assert) {
	visit('/marketplaces/TEST-MP4cOZZqeAelhxXQzljLLtgl/invoices').then(function() {
		assert.equal($("#invoices table tbody tr").length, 20);
	});
});

test('invoice detail page', function(assert) {
	var invoiceUri = '/invoices/IVDOATjeyAPTJMJPnBR83uE';
	var spy = sinon.spy(Balanced.Adapter, "get");

	var expectedValues = {
		".invoice-balance-due-box .amount": "$17.85",
		".hold-details-row .total": "$17.85",
		".hold-details-row td:eq(3)": "$0.00 per hold",
		".card-debit-details-row .total": "$2.45",
		".card-debit-details-row td:eq(3)": "3.5% of txn amount + 29 cents",
		".bank-account-debit-details-row .total": "$0.00",
		".succeeded-credit-details-row .total": "$0.00",
		".failed-credit-details-row .total": "$0.00",
		".refund-details-row .total": "-$2.45",
		".reversal-details-row .total": "$0.00",
		".chargeback-details-row .total": "$0.00",
		".invoice-details-table .subtotal-row .total": "$17.85"
	};


	visit('/marketplaces/TEST-MP4cOZZqeAelhxXQzljLLtgl' + invoiceUri)
		.then(function() {
			_.each(expectedValues, function(value, selector) {
				assert.equal($(selector).text().trim(), value);
			});

			assert.ok(spy.calledWith(Balanced.Invoice, invoiceUri));
		})
		.click('.activity .results header li.debit-cards a')
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Debit, invoiceUri + '/card_debits'));
		})
		.click('.activity .results header li.holds a')
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Hold, invoiceUri + '/holds'));
		})
		.click('.activity .results header li.debit-bank-accounts a')
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Debit, invoiceUri + '/bank_account_debits'));
		})
		.click('.activity .results header li.credits a')
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Credit, invoiceUri + '/credits'));
		})
		.click('.activity .results header li.refunds a')
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Refund, invoiceUri + '/refunds'));
		});
	// TODO: Tests for enabling invoice disputes
	// .click('.activity .results header li.disputes-lost a')
	// .then(function() {
	// assert.ok(spy.calledWith(Balanced.Dispute, invoiceUri + '/disputes'));
	// });
});

test('change invoice funding source', function(assert) {
	var invoiceUri = '/invoices/IVDOATjeyAPTJMJPnBR83uE';
	var spy = sinon.spy(Balanced.Adapter, "get");
	var stub = sinon.stub(Balanced.Adapter, "update");
	stub.callsArg(3);

	visit('/marketplaces/TEST-MP4cOZZqeAelhxXQzljLLtgl' + invoiceUri)
		.click('.change-funding-source-btn')
		.fillIn('#change-funding-source form select[name="source_uri"]', '123')
		.click('#change-funding-source form button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Invoice, invoiceUri));
			assert.equal(spy.callCount, 8);
			assert.ok(stub.calledWith(Balanced.Invoice, invoiceUri));
			assert.equal(stub.callCount, 1);
		});
});
