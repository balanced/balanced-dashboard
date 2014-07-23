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
	invoicesController.minDate = moment('2013-08-01T00:00:00.000Z').toDate();
	invoicesController.maxDate = moment('2013-08-01T23:59:59.999Z').toDate();

	visit(INVOICES_ROUTE)
		.checkElements({
			"#content h1": "Account statements",
			"table.invoices tbody tr": 19
		}, assert);
});

test('disputes invoice details page', function(assert) {
	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/account_statements/IV7GSC6Fm4gx7UxjnmNXJ54X")
		.checkElements({
			".dispute-details-row td:eq(1)": "1",
			".dispute-details-row .total": "$113.10",
		}, assert);
});

test("transactions invoice detail page filters", function(assert) {
	var invoiceUri = '/invoices/IVDOATjeyAPTJMJPnBR83uE';
	var spy;

	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/account_statements/IVDOATjeyAPTJMJPnBR83uE")
		.then(function() {
			spy = sinon.stub(Balanced.Adapter, "get");
		})
		.click('.results .type-filter a:contains(Debits)')
		.click('.results .type-filter a:contains(Refunds)')
		.then(function() {
			assert.deepEqual(spy.getCall(0).args.slice(0, 2), [Balanced.Transaction, invoiceUri + '/debits?limit=50&sort=created_at%2Cdesc']);
			assert.deepEqual(spy.getCall(1).args.slice(0, 2), [Balanced.Transaction, invoiceUri + '/refunds?limit=50&sort=created_at%2Cdesc']);
		});
});

test('transactions invoice detail page', function(assert) {
	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/account_statements/IVDOATjeyAPTJMJPnBR83uE")
		.checkElements({
			".card-debit-details-row .total": "$2.45",
			".card-debit-details-row td:eq(3)": "3.5% of txn amount + 29¢",
			".bank-account-debit-details-row .total": "$0.00",
			".succeeded-bank-account-credit-details-row .total": "$0.00",
			".succeeded-card-credit-details-row .total": "$0.00",
			".refund-details-row .total": "-$2.45",
		}, assert);
});

test('change invoice funding source', function(assert) {
	var invoiceUri = '/invoices/IVDOATjeyAPTJMJPnBR83uE';
	var spy = sinon.spy(Balanced.Adapter, "get");
	var stub = sinon.stub(Balanced.Adapter, "update");
	stub.callsArg(3);

	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/account_statements/IVDOATjeyAPTJMJPnBR83uE")
		.then(function() {
			assert.ok(false, "Pending");
		});
/*
		.click('.change-funding-source-btn')
		.fillIn('#change-funding-source form select[name=source_uri]', '123')
		.click('#change-funding-source form button[name=modal-submit]')
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Invoice, invoiceUri));
			assert.equal(spy.callCount, 6);
			assert.ok(stub.calledWith(Balanced.Invoice, invoiceUri));
			assert.equal(stub.callCount, 1);
		});
		*/
});
