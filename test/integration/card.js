var settingsRoutePath = '/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/settings';

module('Card Page', {
	setup: function () {
	}, teardown: function () {
	}
});

test('can view card page', function (assert) {
  visit(settingsRoutePath)
  .click(".card-info .sidebar-items li:eq(0) .name")
  .then(function() {
    assert.equal($('#content h1').text().trim(), 'Card');
    assert.equal($(".title span").text().trim(), 'Test Card 1 (0005)');
  });
});

test('debit card', function (assert) {
  var spy = sinon.spy(Balanced.Adapter, "create");

  visit(settingsRoutePath)
  .click(".card-info .sidebar-items li:eq(0) .name")
	.click(".main-header .buttons a.debit-button")
	.fillIn('#debit-funding-instrument .modal-body input[name="dollar_amount"]', "1000")
	.fillIn('#debit-funding-instrument .modal-body input[name="description"]', "Test debit")
  .click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
  .then(function() {
    assert.ok(spy.calledOnce);
    assert.ok(spy.calledWith(Balanced.Debit, "/v1/customers/CU1DkfCFcAemmM99fabUso2c/debits", {
      amount: 100000,
      description: "Test debit",
      source_uri: "/v1/customers/CU1DkfCFcAemmM99fabUso2c/cards/CC1BkhJFryfa4hvIIsbDl1Bd"
    }));
  });
});

test('debiting only submits once despite multiple clicks', function (assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

  visit(settingsRoutePath)
  .click(".card-info .sidebar-items li:eq(0) .name")
	.click(".main-header .buttons a.debit-button")
	.fillIn('#debit-funding-instrument .modal-body input[name="dollar_amount"]', "1000")
	.fillIn('#debit-funding-instrument .modal-body input[name="description"]', "Test debit")
  .click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
  .click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
  .click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
  .click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
  .then(function() {
    assert.ok(stub.calledOnce);
  });
});
