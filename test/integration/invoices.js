var INVOICES_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/invoices';

module('Invoices', {
	setup: function() {
		Testing.useFixtureData();
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	visit(INVOICES_ROUTE)
		.then(function() {
			//  check the page title has been selected
			assert.equal($('#content h1').text().trim(), 'Invoices');
		});
});

test('shows invoices list', function(assert) {
	visit(INVOICES_ROUTE)
		.then(function() {
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
		".chargeback-details-row td:eq(1)": "1",
		".bank-account-debit-details-row .total": "$0.00",
		".succeeded-credit-details-row .total": "$0.00",
		".failed-credit-details-row .total": "$0.00",
		".refund-details-row .total": "-$2.45",
		".reversal-details-row .total": "$0.00",
		".chargeback-details-row .total": "$0.00",
		".invoice-details-table .subtotal-row .total": "$17.85"
	};

	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + invoiceUri)
		.checkElements(expectedValues, assert)
		.click('.activity .results header li.holds a')
		.click('.activity .results header li.debit-cards a')
		.click('.activity .results header li.debit-bank-accounts a')
		.click('.activity .results header li.credits a')
		.click('.activity .results header li.failed-credits a')
		.click('.activity .results header li.refunds a')
		.click('.activity .results header li.reversals a')
		.click('.activity .results header li.disputes a')
		.then(function() {
			var expectations = [
				[Balanced.Hold, "/holds"],
				[Balanced.Debit, '/card_debits'],
				[Balanced.Debit, '/bank_account_debits'],
				[Balanced.Credit, '/credits'],
				[Balanced.Credit, '/failed_credits'],
				[Balanced.Refund, '/refunds'],
				[Balanced.Reversal, '/reversals'],
				[Balanced.Dispute, '/disputes']
			];

			var assertCall = function (callNumber, model, uri) {
				var callArguments = spy.getCall(callNumber).args.slice(0, 2);
				var expectation = [
					model,
					invoiceUri + uri
				];
				assert.deepEqual(callArguments, expectation, "Call %@ Arguments".fmt(callNumber));
			};

			expectations.forEach(function(expectation, i) {
				assertCall(i + 3, expectation[0], expectation[1]);
			});
		});
});

test('change invoice funding source', function(assert) {
	var invoiceUri = '/invoices/IVDOATjeyAPTJMJPnBR83uE';
	var spy = sinon.spy(Balanced.Adapter, "get");
	var stub = sinon.stub(Balanced.Adapter, "update");
	stub.callsArg(3);

	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + invoiceUri)
		.click('.change-funding-source-btn')
		.fillIn('#change-funding-source form select[name="source_uri"]', '123')
		.click('#change-funding-source form button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Invoice, invoiceUri));
			assert.equal(spy.callCount, 6);
			assert.ok(stub.calledWith(Balanced.Invoice, invoiceUri));
			assert.equal(stub.callCount, 1);
		});
});
