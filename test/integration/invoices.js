var INVOICES_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/account_statements';

module('Invoices', {
	setup: function() {
		Testing.useFixtureData();
	},
	teardown: function() {}
});

asyncTest('can visit page', 2, function(assert) {
	var invoicesController = Balanced.__container__.lookup('controller:marketplace_invoices');
	invoicesController.reopen({
		minDate: moment('2013-08-01T00:00:00.000Z').toDate(),
		maxDate: moment('2013-08-01T23:59:59.999Z').toDate()
	});

	visit(INVOICES_ROUTE)
		.checkElements({
			"#content h1": "Account statements",
			"#invoices table tbody tr": 19
		}, assert)
		.then(function() {
			start();
		});
});

test('disputes invoice details page', function(assert) {
	var invoiceUri = '/invoices/IV7GSC6Fm4gx7UxjnmNXJ54X';
	var spy = sinon.spy(Balanced.Adapter, "get");

	var expectedValues = {
		".chargeback-details-row td:eq(1)": "1",
		".chargeback-details-row .total": "$1.23",
	};

	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/account_statements/IV7GSC6Fm4gx7UxjnmNXJ54X")
		.checkElements(expectedValues, assert);
});

test('transactions invoice detail page', function(assert) {
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
		".invoice-details-table .subtotal-row .total": "$17.85"
	};

	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/account_statements/IVDOATjeyAPTJMJPnBR83uE")
		.checkElements(expectedValues, assert)
		.click('.activity .results .type-filter :contains(Holds)')
		.click('.activity .results .type-filter :contains(Credits)')
		.click('.activity .results .type-filter :contains(Refunds)')
		.then(function() {
			var expectations = [
				[Balanced.Hold, "/holds"],
				[Balanced.Credit, '/credits'],
				[Balanced.Refund, '/refunds']
			];

			var assertCall = function(callNumber, model, uri) {
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

	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/account_statements/IVDOATjeyAPTJMJPnBR83uE")
		.click('.change-funding-source-btn')
		.fillIn('#change-funding-source form select[name=source_uri]', '123')
		.click('#change-funding-source form button[name=modal-submit]')
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Invoice, invoiceUri));
			assert.equal(spy.callCount, 6);
			assert.ok(stub.calledWith(Balanced.Invoice, invoiceUri));
			assert.equal(stub.callCount, 1);
		});
});
