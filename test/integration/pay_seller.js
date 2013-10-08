var marketplaceRoute;

module('Pay Seller', {
	setup: function() {
		marketplaceRoute = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID;
	},
	teardown: function() {
		$("#pay-seller").modal('hide');
	}
});

test('can pay a seller', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(marketplaceRoute)
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
		});
});

test('pay a seller only submits once despite multiple button clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(marketplaceRoute)
		.click('li.pay-seller a')
		.fillIn('#pay-seller .modal-body input:eq(0)', 'TEST')
		.fillIn('#pay-seller .modal-body input:eq(1)', '123123123')
		.fillIn('#pay-seller .modal-body input:eq(2)', '123123123')
		.fillIn('#pay-seller .modal-body select:eq(0)', 'checking')
		.fillIn('#pay-seller .modal-body input:eq(3)', '98')
		.fillIn('#pay-seller .modal-body input:eq(4)', 'Test Transaction')
		.click('#pay-seller .modal-footer button:eq(1)')
		.click('#pay-seller .modal-footer button:eq(1)')
		.click('#pay-seller .modal-footer button:eq(1)')
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});
