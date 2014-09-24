var INVOICES_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/account_statements';

module('Invoices', {
	setup: function() {
		Testing.useFixtureData();
	},
	teardown: function() {
		Testing.restoreMethods(
			BalancedApp.Adapter.get,
			BalancedApp.Adapter.update
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
			spy = sinon.stub(BalancedApp.Adapter, "get");
		})
		.click('.main-panel .search-filters-header a:contains(Debits (Cards))')
		.click('.main-panel .search-filters-header a:contains(Refunds)')
		.then(function() {
			assert.deepEqual(spy.getCall(0).args.slice(0, 2), [Balanced.Transaction, invoiceUri + '/card_debits?limit=50&sort=created_at%2Cdesc']);
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
	var stub = sinon.stub(BalancedApp.Adapter, "update");
	stub.callsArg(3);

	visit(Testing.FIXTURE_MARKETPLACE_ROUTE + "/account_statements/IVDOATjeyAPTJMJPnBR83uE")
		.then(function() {
			var marketplace = Balanced.__container__.lookup("controller:marketplace").get("model");
			Ember.run(function() {
				var customer = Balanced.Customer.create();
				marketplace.set("owner_customer", customer);
				customer.set("bank_accounts", [
					Ember.Object.create({
						can_debit: true,
						uri: "/bank_accounts/xxxxxxxxxx",
						description: "Super cool"
					})
				]);
			});
		})
		.click(".change-funding-source")
		.fillIn('#change-funding-source form select[name=source]', '123')
		.click('#change-funding-source form button[name=modal-submit]')
		.then(function() {
			var args = stub.firstCall.args;
			assert.equal(stub.callCount, 1);
			assert.deepEqual(args.slice(0, 2), [Balanced.Invoice, invoiceUri]);
			assert.equal(args[2].source_uri, "/bank_accounts/xxxxxxxxxx");
		});
});
