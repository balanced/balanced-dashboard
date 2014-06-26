var INVOICES_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/account_statements';

module('Invoices', {
	setup: function() {
		Testing.useFixtureData();
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter.get,
			Balanced.Adapter.update
		);
	}
});

test('can visit page', function(assert) {
	var invoicesController = Balanced.__container__.lookup('controller:marketplace_invoices');
	invoicesController.setProperties({
		minDate: moment('2013-08-01T00:00:00.000Z').toDate(),
		maxDate: moment('2013-08-01T23:59:59.999Z').toDate()
	});

	visit(INVOICES_ROUTE)
		.checkElements({
			"#content h1": "Account statements",
			"#invoices table tbody tr": 19
		}, assert);
});

test('disputes invoice details page', function(assert) {
	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/account_statements/IV7GSC6Fm4gx7UxjnmNXJ54X")
		.checkElements({
			".chargeback-details-row td:eq(1)": "1",
			".chargeback-details-row .total": "$1.23",
		}, assert);
});

test("transactions invoice detail page filters", function(assert) {
	var invoiceUri = '/invoices/IVDOATjeyAPTJMJPnBR83uE';
	var spy = undefined;

	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/account_statements/IVDOATjeyAPTJMJPnBR83uE")
		.then(function() {
			spy = sinon.spy(Balanced.Adapter, "get");
		})
		.click('.activity .results .type-filter :contains(Holds)')
		.click('.activity .results .type-filter :contains(Credits)')
		.click('.activity .results .type-filter :contains(Refunds)')
		.then(function() {
			var expectations = [
				[Balanced.Credit, invoiceUri + '/credits'],
				[Balanced.Refund, invoiceUri + '/refunds']
			];

			expectations.forEach(function(expectation, i) {
				assert.deepEqual(spy.args[i].slice(0, 2), expectation, "Call %@ Arguments".fmt(i));
			});
		});
});

test('transactions invoice detail page', function(assert) {
	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/account_statements/IVDOATjeyAPTJMJPnBR83uE")
		.checkElements({
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
		}, assert);
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
			assert.equal(spy.callCount, 7);
			assert.ok(stub.calledWith(Balanced.Invoice, invoiceUri));
			assert.equal(stub.callCount, 1);
		});
});
