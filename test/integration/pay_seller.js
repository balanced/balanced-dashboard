module('Pay Seller', {
	setup: function() {
		Testing.setupMarketplace();
	},
	teardown: function() {
		$("#pay-seller").modal('hide');
	}
});

test('can pay a seller', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.MARKETPLACES_ROUTE)
		.click('div a.pay-a-seller')
		.fillForm('#pay-seller', {
			'input:eq(0)': 'TEST',
			'input:eq(1)': '123123123',
			'input:eq(2)': '123123123',
			'select:eq(0)': 'checking',
			'input:eq(3)': '98',
			'input:eq(4)': 'Test Transaction'
		}, {
			click: '.modal-footer button:eq(1)'
		})
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.Credit, "/credits", sinon.match({
				amount: 9800,
				appears_on_statement_as: "Test Transaction",
				destination: {
					account_number: "123123123",
					name: "TEST",
					routing_number: "123123123",
					type: "checking"
				}
			})));
		});
});

test('pay a seller only submits once despite multiple button clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.MARKETPLACES_ROUTE)
		.click('div a.pay-a-seller')
		.fillForm('#pay-seller', {
			'input:eq(0)': 'TEST',
			'input:eq(1)': '123123123',
			'input:eq(2)': '123123123',
			'select:eq(0)': 'checking',
			'input:eq(3)': '98',
			'input:eq(4)': 'Test Transaction'
		}, {
			clickMultiple: '.modal-footer button:eq(1)'
		})
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});
