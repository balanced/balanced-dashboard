var addBankAccountsRoutePath = '/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/bank_accounts/BA5r9JGZJ7YOCiULGthQYjVc'

module('Bank Account Page', {
	setup: function () {
		Testing.selectMarketplaceByName();

		// click the settings link
		$('#marketplace-nav .settings a').click();

		// click on the first bank account
		$(".bank-account-info .sidebar-items li").first().find(".name").click();
	}, teardown: function () {
		$('#credit-bank-account').modal('hide');
		$('#debit-funding-instrument').modal('hide');
		$('#verify-bank-account').modal('hide');
		$('#confirm-verification').modal('hide');
	}
});

test('can view bank account page', function(assert) {
  visit(addBankAccountsRoutePath).then(function() {
    assert.equal($("#content h1").text().trim(), 'Bank Account');
    assert.equal($(".title span").text().trim(), 'Test (5555)');
  });
});

test('credit bank account', function (assert) {
  var spy = sinon.spy(Balanced.Adapter, "create");

  visit(addBankAccountsRoutePath)
	.click(".main-header .buttons a.credit-button")
	.fillIn('#credit-bank-account .modal-body input[name="dollar_amount"]', '1000')
	.fillIn('#credit-bank-account .modal-body input[name="description"]', 'Test debit')
	.click('#credit-bank-account .modal-footer button[name="modal-submit"]')
  .then(function() {
    // should be one create for the debit
    assert.ok(spy.calledOnce);
    assert.ok(spy.calledWith(Balanced.Credit, '/v1/customers/AC5m0wzuMTw3JbKP4uIZXFpC/credits', {
      amount: 100000,
      bank_account_uri: "/v1/customers/CU1DkfCFcAemmM99fabUso2c/bank_accounts/BA5r9JGZJ7YOCiULGthQYjVc",
      description: "Test debit"
    }));
  });
});

test('crediting only submits once despite multiple clicks', function (assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

  visit(addBankAccountsRoutePath)
	.click(".main-header .buttons a.credit-button")
	.fillIn('#credit-bank-account .modal-body input[name="dollar_amount"]', '1000')
	.fillIn('#credit-bank-account .modal-body input[name="description"]', 'Test debit')
	.click('#credit-bank-account .modal-footer button[name="modal-submit"]')
  .then(function() {
    assert.ok(stub.calledOnce);
  });
});

test('debit bank account', function (assert) {
	var createsBefore = Balanced.Adapter.creates.length;

	assert.equal($(".main-header .buttons a.debit-button").length, 1);

	// click the debit button
	$(".main-header .buttons a.debit-button").click();

	$('#debit-funding-instrument .modal-body input[name="dollar_amount"]').val("1000").trigger('keyup');
	$('#debit-funding-instrument .modal-body input[name="description"]').val("Test debit").trigger('keyup');

	// click debit
	$('#debit-funding-instrument .modal-footer button[name="modal-submit"]').click();

	// should be one create for the debit
	assert.equal(Balanced.Adapter.creates.length, createsBefore + 1);
});

test('debiting only submits once despite multiple clicks', function (assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	// click the debit button
	$(".main-header .buttons a.debit-button").click();

	$('#debit-funding-instrument .modal-body input[name="dollar_amount"]').val("1000").trigger('keyup');
	$('#debit-funding-instrument .modal-body input[name="description"]').val("Test debit").trigger('keyup');

	// click debit
	for (var i = 0; i < 20; i++) {
		$('#debit-funding-instrument .modal-footer button[name="modal-submit"]').click();
	}

	assert.ok(stub.calledOnce);
});

test('can initiate bank account verification', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	// click the settings link
	$('#marketplace-nav .settings a').click();

	// click on the third bank account (which has no verification)
	$(".bank-account-info .sidebar-items li").eq(2).find(".name").click();

	assert.equal($('#content h1').text().trim(), 'Bank Account');

	assert.equal($(".main-header .buttons a.verify-button").length, 1, 'has verify button');

	// click the verify button
	$(".main-header .buttons a.verify-button").click();

	assert.equal($('#verify-bank-account').css('display'), 'block', 'verify bank account modal visible');

	$('#verify-bank-account .modal-footer button[name="modal-submit"]').click();

	assert.ok(stub.calledOnce);
});

test('can confirm bank account verification', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "update");

	// click the settings link
	$('#marketplace-nav .settings a').click();

	// click on the fourth bank account (which has a pending verification)
	$(".bank-account-info .sidebar-items li").eq(3).find(".name").click();

	assert.equal($('#content h1').text().trim(), 'Bank Account');

	assert.equal($(".main-header .buttons a.confirm-verification-button").length, 1, 'has confirm button');

	// click the confirm button
	$(".main-header .buttons a.confirm-verification-button").click();

	assert.equal($('#confirm-verification').css('display'), 'block', 'confirm verification modal visible');

	$('#confirm-verification .modal-body input[name="amount_1"]').val('1.00').trigger('keyup');
	$('#confirm-verification .modal-body input[name="amount_2"]').val('1.00').trigger('keyup');

	$('#confirm-verification .modal-footer button[name="modal-submit"]').click();

	assert.ok(stub.calledOnce);
});
