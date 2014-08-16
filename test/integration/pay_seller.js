module('Pay Seller', {
	setup: function() {
		Testing.setupMarketplace();
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter.create
		);
	}
});

test('can pay a seller', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.MARKETPLACES_ROUTE)
		.click(".page-navigation a:contains(Credit a bank account)")
		.fillForm('#pay-seller', {
			'name': 'TEST',
			'routing_number': '123123123',
			'account_number': '123123123',
			'account_type': 'checking',
			'dollar_amount': '98',
			'appears_on_statement_as': 'Transaction',
			'description': "Cool"
		})
		.click('#pay-seller .modal-footer button:contains(Credit)')
		.then(function() {
			assert.ok(stub.calledOnce, "Called Once");
			assert.deepEqual(stub.firstCall.args.slice(0, 3), [Balanced.Credit, "/credits", {
				amount: "9800",
				appears_on_statement_as: "Transaction",
				description: "Cool",
				destination: {
					account_number: "123123123",
					name: "TEST",
					routing_number: "123123123",
					account_type: "checking"
				}
			}]);
		});
});

test('pay a seller only submits once despite multiple button clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.MARKETPLACES_ROUTE)
		.click(".page-navigation a:contains(Credit a bank account)")
		.fillForm('#pay-seller', {
			'name': 'TEST',
			'routing_number': '123123123',
			'account_number': '123123123',
			'account_type': 'checking',
			'dollar_amount': '98',
			'appears_on_statement_as': 'Transaction'
		}, {
			clickMultiple: '.modal-footer button:contains(Credit)'
		})
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});
