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

	visit('/marketplaces/TEST-MP4cOZZqeAelhxXQzljLLtgl' + invoiceUri)
		.then(function() {
			assert.equal($(".invoice-balance-due-box .amount").text().trim(), "$17.85");
			assert.equal($(".hold-details-row .total").text().trim(), "$17.85");
			assert.equal($(".card-debit-details-row .total").text().trim(), "$2.45");
			assert.equal($(".bank-account-debit-details-row .total").text().trim(), "$0.00");
			assert.equal($(".succeeded-credit-details-row .total").text().trim(), "$0.00");
			assert.equal($(".failed-credit-details-row .total").text().trim(), "$0.00");
			assert.equal($(".refund-details-row .total").text().trim(), "-$2.45");
			assert.equal($(".reversal-details-row .total").text().trim(), "$0.00");
			assert.equal($(".chargeback-details-row .total").text().trim(), "$0.00");
			assert.equal($(".invoice-details-table .subtotal-row .total").text().trim(), "$17.85");
			//assert.equal($(".adjustments-row .total").text().trim(), "$0.00");

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
			assert.equal(spy.callCount, 7);
			assert.ok(stub.calledWith(Balanced.Invoice, invoiceUri));
			assert.equal(stub.callCount, 1);
		});
});
