module('Pay Seller', {
	setup: function() {
		Testing.selectMarketplaceByName();
	},
	teardown: function() {
		Ember.run(function() {
			$("#pay-seller").modal('hide');
		});
	}
});

test('can pay a seller', function(assert) {
	var createsBefore = Balanced.Adapter.creates.length;

	// click the button to pay a seller
	$('li.pay-seller a').click();

	// fill out information
	$('#pay-seller .modal-body input').eq(0).val('TEST').trigger('keyup');
	$('#pay-seller .modal-body input').eq(1).val('123123123').trigger('keyup');
	$('#pay-seller .modal-body input').eq(2).val('123123123').trigger('keyup');
	$('#pay-seller .modal-body select').eq(0).val('checking').trigger('keyup');
	$('#pay-seller .modal-body input').eq(3).val('98').trigger('keyup');
	$('#pay-seller .modal-body input').eq(4).val('Test Transaction').trigger('keyup');
	// click save
	$('#pay-seller .modal-footer button')[1].click();

	// should be one create
	assert.equal(Balanced.Adapter.creates.length, createsBefore + 1);
});

test('pay a seller only submits once despite multiple button clicks', function(assert) {
	expect(1);

	var stub = sinon.stub(Balanced.Adapter, "create");

	// click the button to pay a seller
	$('li.pay-seller a').click();

	// fill out information
	$('#pay-seller .modal-body input').eq(0).val('TEST').trigger('keyup');
	$('#pay-seller .modal-body input').eq(1).val('123123123').trigger('keyup');
	$('#pay-seller .modal-body input').eq(2).val('123123123').trigger('keyup');
	$('#pay-seller .modal-body select').eq(0).val('checking').trigger('keyup');
	$('#pay-seller .modal-body input').eq(3).val('98').trigger('keyup');
	$('#pay-seller .modal-body input').eq(4).val('Test Transaction').trigger('keyup');
	// click save
	for (var i = 0; i < 20; i++) {
		$('#pay-seller .modal-footer button[name="modal-submit"]').click();
	}

	assert.ok(stub.calledOnce);
});
