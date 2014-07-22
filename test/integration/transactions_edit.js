module('TransactionsEdit', {
	setup: function() {
		Testing.setupMarketplace();
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter.update
		);
	}
});

test('can edit credit', function(assert) {
	Testing.createCredit();
	var href = "/credits/" + Testing.CREDIT_ID;
	visit(Testing.CREDIT_ROUTE)
		.testEditTransaction(Balanced.Credit, href, assert);
});

test('can edit debit', function(assert) {
	Testing.createDebit();
	var href = '/debits/' + Testing.DEBIT_ID;
	visit(Testing.CREDIT_ROUTE)
		.testEditTransaction(Balanced.Debit, href, assert);
});
