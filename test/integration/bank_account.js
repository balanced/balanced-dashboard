var addBankAccountsRoutePath = '/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/bank_accounts/BA5r9JGZJ7YOCiULGthQYjVc';

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
	.fillIn('#credit-bank-account .modal-body input[name="description"]', 'Test credit')
	.click('#credit-bank-account .modal-footer button[name="modal-submit"]')
  .then(function() {
    // should be one create for the debit
    assert.ok(spy.calledOnce);
    assert.ok(spy.calledWith(Balanced.Credit, '/v1/customers/AC5m0wzuMTw3JbKP4uIZXFpC/credits', {
      amount: 100000,
      bank_account_uri: "/v1/customers/CU1DkfCFcAemmM99fabUso2c/bank_accounts/BA5r9JGZJ7YOCiULGthQYjVc",
      description: "Test credit"
    }));
  });
});

test('crediting only submits once despite multiple clicks', function (assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

  visit(addBankAccountsRoutePath)
	.click(".main-header .buttons a.credit-button")
	.fillIn('#credit-bank-account .modal-body input[name="dollar_amount"]', '1000')
	.fillIn('#credit-bank-account .modal-body input[name="description"]', 'Test credit')
	.click('#credit-bank-account .modal-footer button[name="modal-submit"]')
	.click('#credit-bank-account .modal-footer button[name="modal-submit"]')
	.click('#credit-bank-account .modal-footer button[name="modal-submit"]')
	.click('#credit-bank-account .modal-footer button[name="modal-submit"]')
  .then(function() {
    assert.ok(stub.calledOnce);
  });
});

test('debit bank account', function (assert) {
  var spy = sinon.spy(Balanced.Adapter, "create");

  visit(addBankAccountsRoutePath)
	.click(".main-header .buttons a.debit-button")
	.fillIn('#debit-funding-instrument .modal-body input[name="dollar_amount"]', '1000')
	.fillIn('#debit-funding-instrument .modal-body input[name="description"]', 'Test debit')
	.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
  .then(function() {
    assert.ok(spy.calledOnce);
    assert.ok(spy.calledWith(Balanced.Debit, '/v1/bank_accounts/BA5r9JGZJ7YOCiULGthQYjVc/debits', {
      amount: 100000,
      description: "Test debit",
      source_uri: "/v1/customers/CU1DkfCFcAemmM99fabUso2c/bank_accounts/BA5r9JGZJ7YOCiULGthQYjVc"
    }));
  });
});

test('debiting only submits once despite multiple clicks', function (assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

  visit(addBankAccountsRoutePath)
	.click(".main-header .buttons a.debit-button")
	.fillIn('#debit-funding-instrument .modal-body input[name="dollar_amount"]', '1000')
	.fillIn('#debit-funding-instrument .modal-body input[name="description"]', 'Test debit')
	.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
	.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
	.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
	.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
  .then(function() {
    assert.ok(stub.calledOnce);
  });
});

test('can initiate bank account verification', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

  visit(addBankAccountsRoutePath)
	.click('#marketplace-nav .settings a')
	.click(".bank-account-info .sidebar-items li:eq(2) .name")
  .then(function() {
    assert.equal($('#content h1').text().trim(), 'Bank Account');
    assert.equal($(".main-header .buttons a.verify-button").length, 1, 'has verify button');
  })
  .then(function() {
    click(".main-header .buttons a.verify-button");
    assert.equal($('#verify-bank-account').css('display'), 'block', 'verify bank account modal visible');
  })
  .then(function() {
    click('#verify-bank-account .modal-footer button[name="modal-submit"]');
    assert.ok(stub.calledOnce);
  });
});

test('can confirm bank account verification', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "update");

  visit(addBankAccountsRoutePath)
	.click('#marketplace-nav .settings a')
	.click(".bank-account-info .sidebar-items li:eq(3) .name")
  .then(function() {
    assert.equal($('#content h1').text().trim(), 'Bank Account');
    assert.equal($(".main-header .buttons a.confirm-verification-button").length, 1, 'has confirm button');
  })
  .then(function() {
    click(".main-header .buttons a.confirm-verification-button");

    assert.equal($('#confirm-verification').css('display'), 'block', 'confirm verification modal visible');

    fillIn('#confirm-verification .modal-body input[name="amount_1"]', '1.00');
    fillIn('#confirm-verification .modal-body input[name="amount_2"]', '1.00');

    click('#confirm-verification .modal-footer button[name="modal-submit"]');

    assert.ok(stub.calledOnce);
  });
});
