/*
 * TODO: Some of these tests are not working because the balanced.js library
 * does not appear to be loaded correctly and form validation therefore fails.
 */
module('Balanced.Marketplaces.initial_deposit', {
	setup: function() {
		Testing.setupMarketplace();
	},
	teardown: function() {

	}
});

test('on the correct page', function(assert) {
	visit(Testing.INITIAL_DEPOSIT_ROUTE).then(function() {
		assert.equal($('h1', '#marketplace-initial-deposit').text(), 'Make an initial deposit', 'title is correct');
	});
});

test('form validation', function(assert) {
	visit(Testing.INITIAL_DEPOSIT_ROUTE).then(function() {
		var $submitButton = $('button:contains("Submit")');
		assert.equal($submitButton.length, 1, 'submit button exists');
	})
		.then(function() {
			click($('button:contains("Submit")'));
			assert.equal($('.control-group.error').length, 2, 'errors are displayed');
		});
});

test('payment success', function(assert) {
	visit(Testing.INITIAL_DEPOSIT_ROUTE).then(function() {
		populateData(goodData);
		var $submitButton = $('button:contains("Submit")');
		assert.equal($submitButton.length, 1, 'submit button exists');
	});

	var spy = sinon.spy(Balanced.Debit, 'create');

	visit(initialDepositRoute)
		.fillIn('input[name="card_number"]', '341111111111111')
		.fillIn('input[name="security_code"]', '1234')
		.fillIn('select[name="expiration_month"]', '12')
		.fillIn('select[name="expiration_year"]', '2020')
		.click('button:contains("Submit")')
		.then(function() {
			assert.ok(Balanced.TEST.cardTokenizingStub.calledOnce);
			assert.ok(spy.calledOnce);
			assert.equal(spy.getCall(0).args[0].amount, "1000");
		});
});

test('cancel', function(assert) {
	visit(Testing.INITIAL_DEPOSIT_ROUTE).then(function() {
		var $skipButton = $('button:contains("Skip")');
		assert.equal($skipButton.length, 1, 'skip button exists');
	}).then(function() {

		click('button:contains("Skip")');
		assert.equal($('.page-title').text().trim(), 'Activity', 'title is correct');
	});
});
