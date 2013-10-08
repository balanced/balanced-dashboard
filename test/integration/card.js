var settingsRoutePath;

module('Card Page', {
	setup: function() {
		settingsRoutePath = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID + '/settings';
		Ember.run(function() {
			Balanced.Card.create({
				uri: '/v1/marketplaces/' + Balanced.TEST.MARKETPLACE_ID + '/cards',
				card_number: '4444400012123434',
				name: 'Test Card',
				expiration_year: 2020,
				expiration_month: 11
			}).save().then(function(card) {
				var uri = card.uri;
				var user = Balanced.Auth.get('user');
				// ghetto workaround
				Balanced.NET.ajax({
					url: ENV.BALANCED.API + user.uri,
					type: 'put',
					data: {
						card_uri: uri
					}
				});
			});
		});
	},
	teardown: function() {}
});

test('can view card page', function(assert) {
	visit(settingsRoutePath)
		.click(".card-info .sidebar-items li:eq(0) .name")
		.then(function() {
			assert.equal($('#content h1').text().trim(), 'Card');
			assert.equal($(".title span").text().trim(), 'Test Card (3434)');
		});
});

test('debit card', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(settingsRoutePath)
		.click(".card-info .sidebar-items li:eq(0) .name")
		.click(".main-header .buttons a.debit-button")
		.fillIn('#debit-funding-instrument .modal-body input[name="dollar_amount"]', "1000")
		.fillIn('#debit-funding-instrument .modal-body input[name="description"]', "Test debit")
		.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Debit, "/v1/customers/" + Balanced.TEST.CUSTOMER_ID + "/debits", sinon.match({
				amount: 100000,
				description: "Test debit"
			})));
		});
});

test('debiting only submits once despite multiple clicks', function(assert) {
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
