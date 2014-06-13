module('Balanced.Marketplaces.apply', {
	setup: function() {
		Testing.APPLY_ROUTE = '/marketplaces/apply';
	},
	teardown: function() {
		Testing.restoreMethods(
			balanced.bankAccount.create,
			Balanced.Adapter.create
		);
	}
});

test('we are on the correct page', function(assert) {
	visit(Testing.APPLY_ROUTE)
		.then(function() {
			assert.equal($('#marketplace-apply h1').text(), 'Apply for a production marketplace');
		});
});

test('clicking business or personal shows data', function(assert) {
	var assertInputsCount = function(count) {
		return function() {
			assert.equal($("#marketplace-apply input").length, count);
		};
	};

	visit(Testing.APPLY_ROUTE)
		.then(assertInputsCount(2))
		.click('a:contains("Business")')
		.then(assertInputsCount(17))
		.click('a:contains("Person")')
		.then(assertInputsCount(14));
});

test('basic form validation and terms and conditions', function(assert) {
	var submitButtonQuery = 'button:contains("Submit")';

	visit(Testing.APPLY_ROUTE)
		.click('a:contains("Person")')
		.then(function() {
			var $submitButton = $(submitButtonQuery);
			assert.equal($submitButton.length, 1);
		})
		.click(submitButtonQuery)
		.checkElements({
			".control-group.error": 12
		}, assert)
		.fillForm(".full-page-form", {
			personFirstName: "Carlos"
		})
		.click('#terms-and-conditions')
		.click(submitButtonQuery)
		.checkElements({
			".control-group.error": 11
		}, assert)
		.fillForm(".full-page-form", {
			personLastName: "Pig"
		})
		.click(submitButtonQuery)
		.checkElements({
			".control-group.error": 10
		}, assert);
});
