module('Charge Card', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createCard();
	},
	teardown: function() {
		$('#charge-card').modal('hide');
	}
});

test('form validation', 2, function(assert) {
	visit(Testing.MARKETPLACES_ROUTE)
		.click('div a.charge-a-card')
		.then(function() {
			var $submitButton = $('button:contains("Charge")');
			assert.equal($submitButton.length, 1, 'submit button exists');
		})
		.click($('button:contains("Charge")'))
		.then(function() {
			assert.ok($('.control-group.error').length > 0, 'errors are displayed');
		});
});

test('can charge a card', 3, function(assert) {
	var spy = sinon.spy(Balanced.Adapter, 'create');
	var tokenizingStub = sinon.stub(balanced.card, 'create');
	tokenizingStub.callsArgWith(1, {
		status: 201,
		cards: [{
			href: '/cards/' + Testing.CARD_ID
		}]
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click('div a.charge-a-card')
		.fillForm('#charge-card', {
			name: 'Tarun Chaudhry',
			number: '4111111111111111',
			security_code: '123',
			expiration_month: '12',
			expiration_year: '2016',
			postal_code: '95014',
			appears_on_statement_as: 'My Charge',
			description: 'Internal',
			amount: '12.00'
		}, {
			click: '.modal-footer button:eq(1)'
		})
		.then(function() {
			assert.ok(tokenizingStub.calledOnce);
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Debit, '/cards/' + Testing.CARD_ID + '/debits', sinon.match({
				amount: 1200,
				appears_on_statement_as: 'My Charge',
				description: 'Internal',
				source_uri: '/cards/' + Testing.CARD_ID
			})));
			tokenizingStub.restore();
		});
});

test('charge a card only submits once despite multiple button clicks', 2, function(assert) {
	var spy = sinon.spy(Balanced.Adapter, 'create');
	var tokenizingStub = sinon.stub(balanced.card, 'create');
	tokenizingStub.callsArgWith(1, {
		status: 201,
		cards: [{
			href: '/cards/' + Testing.CARD_ID
		}]
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click('div a.charge-a-card')
		.fillForm('#charge-card', {
			name: 'Tarun Chaudhry',
			number: '4111111111111111',
			security_code: '123',
			expiration_month: '12',
			expiration_year: '2016',
			postal_code: '95014',
			appears_on_statement_as: 'My Charge',
			description: 'Internal',
			amount: '12.00'
		})
		.click('#charge-card .modal-footer button:eq(1)')
		.click('#charge-card .modal-footer button:eq(1)')
		.click('#charge-card .modal-footer button:eq(1)')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Debit, '/cards/' + Testing.CARD_ID + '/debits', sinon.match({
				amount: 1200,
				appears_on_statement_as: 'My Charge',
				description: 'Internal',
				source_uri: '/cards/' + Testing.CARD_ID
			})));
			tokenizingStub.restore();
		});
});
