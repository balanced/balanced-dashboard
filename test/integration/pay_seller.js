module('Pay Seller', {
	setup: function() {
		Testing.setupMarketplace();
	},
});

test('can pay a seller', 2, function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.MARKETPLACES_ROUTE)
		.click('div a.pay-a-seller')
		.fillForm('#pay-seller', {
			'name': 'TEST',
			'routing_number': '123123123',
			'account_number': '123123123',
			'account_type': 'checking',
			'dollar_amount': '98',
			'appears_on_statement_as': 'Test Transaction',
			'description': "Cool"
		})
		.click('#pay-seller .modal-footer button:eq(1)')
		.then(function() {
			assert.ok(stub.calledOnce, "Called Once");
			assert.deepEqual(stub.firstCall.args.slice(0, 3), [Balanced.Credit, "/credits", {
				amount: "9800",
				appears_on_statement_as: "Test Transaction",
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
		.click('div a.pay-a-seller')
		.fillForm('#pay-seller', {
			'name': 'TEST',
			'routing_number': '123123123',
			'account_number': '123123123',
			'account_type': 'checking',
			'dollar_amount': '98',
			'appears_on_statement_as': 'Test Transaction'
		}, {
			clickMultiple: '.modal-footer button:eq(1)'
		})
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});
