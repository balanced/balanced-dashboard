var initialDepositRoute;
/*
 * TODO: Some of these tests are not working because the balanced.js library
 * does not appear to be loaded correctly and form validation therefore fails.
 */
module('Balanced.Marketplaces.initial_deposit', {
	setup: function() {
		Balanced.TEST.setupMarketplace();
		initialDepositRoute = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID + '/initial_deposit';
	},
	teardown: function() {

	}
});

var goodData = {
	card_number: '341111111111111',
	security_code: '1234',
	expiration_month: 12,
	expiration_year: 2020
};

var nonChargingCard = goodData;
nonChargingCard.card_number = '4444444444444448';

var nonTokenizingCard = goodData;
nonTokenizingCard.card_number = '4222222222222220';

function populateData(data) {
	_.each(data, function(value, key) {
		var $input = $('[name="' + key + '"]');
		$input.val(value);
		$input.keyup();
	});
}

test('on the correct page', function(assert) {
	visit(initialDepositRoute).then(function() {
		assert.equal($('h1', '#marketplace-initial-deposit').text(), 'Make an initial deposit', 'title is correct');
	});
});

test('form validation', function(assert) {
	visit(initialDepositRoute).then(function() {
		var $submitButton = $('button:contains("Submit")');
		assert.equal($submitButton.length, 1, 'submit button exists');
	});
	//    $submitButton.click();
	//
	//    assert.equal($('.control-group.error').length, 2, 'errors are displayed');
});

test('payment success', function(assert) {
	var tokenizingStub = sinon.stub(balanced.card, "create");
	tokenizingStub.callsArgWith(1, {
		status: 201,
		data: {
			uri: "/v1/cards/deadbeef"
		}
	});

	visit(initialDepositRoute)
		.fillIn('input[name="card_number"]', '341111111111111')
		.fillIn('input[name="security_code"]', '1234')
		.fillIn('select[name="expiration_month"]', '12')
		.fillIn('select[name="expiration_year"]', '2020')
		.click('button:contains("Submit")')
		.then(function() {
			assert.ok(tokenizingStub.calledOnce);
		});
});

//test('payment failure', function (assert) {
//    var $submitButton = $('button:contains("Submit")');
//
//    populateData(nonTokenizingCard);
//    $submitButton.click();
//    assert.equal($('.alert').text(), 'Sorry, there was an error tokenizing this card.', 'error message is correct');
//
//    populateData(nonChargingCard);
//    $submitButton.click();
//    assert.equal($('.alert').text(), 'Sorry, there was an error charging this card.', 'error message is correct');
//});

test('cancel', function(assert) {
	visit(initialDepositRoute).then(function() {
		var $skipButton = $('button:contains("Skip")');
		var hash = window.location.hash;
		assert.equal($skipButton.length, 1, 'skip button exists');
	});

	//    $skipButton.click();
	//    assert.notEqual(hash, window.location.hash, 'location has changed');
});
