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
		.click('li.pay-seller a')
		.fillIn('#pay-seller .modal-body input:eq(0)', 'TEST')
		.fillIn('#pay-seller .modal-body input:eq(1)', '123123123')
		.fillIn('#pay-seller .modal-body input:eq(2)', '123123123')
		.fillIn('#pay-seller .modal-body select:eq(0)', 'checking')
		.fillIn('#pay-seller .modal-body input:eq(3)', '98')
		.fillIn('#pay-seller .modal-body input:eq(4)', 'Test Transaction')
		.click('#pay-seller .modal-footer button:eq(1)')
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
		.click('li.pay-seller a')
		.fillIn('#pay-seller .modal-body input:eq(0)', 'TEST')
		.fillIn('#pay-seller .modal-body input:eq(1)', '123123123')
		.fillIn('#pay-seller .modal-body input:eq(2)', '123123123')
		.fillIn('#pay-seller .modal-body select:eq(0)', 'checking')
		.fillIn('#pay-seller .modal-body input:eq(3)', '98')
		.fillIn('#pay-seller .modal-body input:eq(4)', 'Test Transaction')
		.then(function() {
			for (var i = 0; i < 20; i++) {
				click('#pay-seller .modal-footer button:eq(1)');
			}
			assert.ok(stub.calledOnce);
		});
});
