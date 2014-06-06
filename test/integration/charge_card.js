module('Charge Card', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createCard();
	}
});

test('form validation', function(assert) {
	visit(Testing.MARKETPLACES_ROUTE)
		.click('div a.charge-a-card')
		.then(function() {
			assert.equal($('button:contains(Debit)').length, 1, 'submit button exists');
		})
		.click('button:contains(Debit)')
		.then(function() {
			assert.ok($('.control-group.error').length > 0, 'errors are displayed');
		});
});

test('can charge a card', function(assert) {
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
			cvv: '123',
			expiration_month: '12',
			expiration_year: '2016',
			postal_code: '95014',
			appears_on_statement_as: 'My Charge',
			description: 'Internal',
			dollar_amount: '12.00'
		}, {
			click: '.modal-footer button:eq(1)'
		})
		.then(function() {
			assert.ok(tokenizingStub.calledOnce);
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Debit, '/cards/' + Testing.CARD_ID + '/debits', sinon.match({
				amount: "1200",
				appears_on_statement_as: 'My Charge',
				description: 'Internal',
				source_uri: '/cards/' + Testing.CARD_ID
			})));
			tokenizingStub.restore();
		});
});

test('charge a card only submits once despite multiple button clicks', function(assert) {
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
			cvv: '123',
			expiration_month: '12',
			expiration_year: '2016',
			postal_code: '95014',
			appears_on_statement_as: 'My Charge',
			description: 'Internal',
			dollar_amount: '12.00'
		})
		.assertClick("#charge-card .modal-footer .btn:last", assert)
		.then(function() {
			assert.equal($("#charge-card .modal-footer .btn:last").length, 0, "Button not present");
		})
		.then(function() {
			assert.ok(spy.calledOnce, "Called once");
			assert.ok(spy.calledWith(Balanced.Debit, '/cards/' + Testing.CARD_ID + '/debits', sinon.match({
				amount: "1200",
				appears_on_statement_as: 'My Charge',
				description: 'Internal',
				source_uri: '/cards/' + Testing.CARD_ID
			})), "Called with right arguments");
			tokenizingStub.restore();
		});
});

test('when charge a card triggers an error, the error is displayed to the user', function(assert) {
	visit(Testing.MARKETPLACES_ROUTE)
		.click('div a.charge-a-card')
		.fillForm('#charge-card', {
			name: 'Tarun Chaudhry'
		}, {
			click: '.modal-footer button:eq(1)'
		})
		.then(function() {
			Testing.stop();
			Ember.run.next(function() {
				Testing.start();
				assert.equal($('.alert-error').is(':visible'), true);
			});
		});
});
