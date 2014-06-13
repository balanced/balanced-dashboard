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
		.then(assertInputsCount(15))
		.click('a:contains("Person")')
		.then(assertInputsCount(12));
});

test('Person form validation', function(assert) {
	var submitButtonQuery = 'button:contains("Submit")';
	var assertMessages = function(messages) {
		var model = Balanced.__container__.lookup("controller:marketplaces_apply");
		assert.deepEqual(model.get("validationErrors.allMessages"), messages);
	};

	visit(Testing.APPLY_ROUTE)
		.click('a:contains("Person")')
		.then(function() {
			var $submitButton = $(submitButtonQuery);
			assert.equal($submitButton.length, 1);
		})
		.click(submitButtonQuery)
		.then(function() {
			assertMessages([
				["personFullName", "can't be blank"],
				["socialSecurityNumber", "can't be blank"],
				["socialSecurityNumber", "is the wrong length (should be 4 characters)"],
				["socialSecurityNumber", "is not a number"],
				["phoneNumber", "can't be blank"],
				["streetAddress", "can't be blank"],
				["postalCode", "can't be blank"],
				["postalCode", "is too short (minimum 5 characters)"],
				["postalCode", "is invalid"],
				["marketplaceName", "can't be blank"],
				["supportEmailAddress", "can't be blank"],
				["supportPhoneNumber", "can't be blank"],
				["marketplaceDomainUrl", "can't be blank"],
				["termsAndConditions", "must be checked"],
				["claimEmailAddress", "can't be blank"],
				["claimPassword", "can't be blank"]
			]);
		})
		.checkElements({
			".control-group.error": 12
		}, assert)
		.fillForm(".full-page-form", {
			personFullName: "Mr. Frog",
			socialSecurityNumber: "0000"
		})
		.click('#terms-and-conditions')
		.click(submitButtonQuery)
		.then(function() {
			assertMessages([
				["phoneNumber", "can't be blank"],
				["streetAddress", "can't be blank"],
				["postalCode", "can't be blank"],
				["postalCode", "is too short (minimum 5 characters)"],
				["postalCode", "is invalid"],
				["marketplaceName", "can't be blank"],
				["supportEmailAddress", "can't be blank"],
				["supportPhoneNumber", "can't be blank"],
				["marketplaceDomainUrl", "can't be blank"],
				["claimEmailAddress", "can't be blank"],
				["claimPassword", "can't be blank"]
			]);
		})
		.checkElements({
			".control-group.error": 9
		}, assert);
});

test('Business form validation', function(assert) {
	var submitButtonQuery = 'button:contains("Submit")';
	var assertMessages = function(messages) {
		var model = Balanced.__container__.lookup("controller:marketplaces_apply");
		assert.deepEqual(model.get("validationErrors.allMessages"), messages);
	};

	visit(Testing.APPLY_ROUTE)
		.click('a:contains("Business")')
		.then(function() {
			var $submitButton = $(submitButtonQuery);
			assert.equal($submitButton.length, 1);
		})
		.click(submitButtonQuery)
		.then(function() {
			assertMessages([
				["employerIdentificationNumber", "can't be blank"],
				["businessName", "can't be blank"],
				["principalOwnerName", "can't be blank"],
				["personFullName", "can't be blank"],
				["socialSecurityNumber", "can't be blank"],
				["socialSecurityNumber", "is the wrong length (should be 4 characters)"],
				["socialSecurityNumber", "is not a number"],
				["phoneNumber", "can't be blank"],
				["streetAddress", "can't be blank"],
				["postalCode", "can't be blank"],
				["postalCode", "is too short (minimum 5 characters)"],
				["postalCode", "is invalid"],
				["marketplaceName", "can't be blank"],
				["supportEmailAddress", "can't be blank"],
				["supportPhoneNumber", "can't be blank"],
				["marketplaceDomainUrl", "can't be blank"],
				["termsAndConditions", "must be checked"],
				["claimEmailAddress", "can't be blank"],
				["claimPassword", "can't be blank"]
			]);
		})
		.checkElements({
			".control-group.error": 15
		}, assert)
		.fillForm(".full-page-form", {
			personFullName: "Mr. Frog",
			employerIdentificationNumber: "12312312",
			socialSecurityNumber: "0000"
		})
		.click('#terms-and-conditions')
		.click(submitButtonQuery)
		.then(function() {
			assertMessages([
				["businessName", "can't be blank"],
				["principalOwnerName", "can't be blank"],
				["phoneNumber", "can't be blank"],
				["streetAddress", "can't be blank"],
				["postalCode", "can't be blank"],
				["postalCode", "is too short (minimum 5 characters)"],
				["postalCode", "is invalid"],
				["marketplaceName", "can't be blank"],
				["supportEmailAddress", "can't be blank"],
				["supportPhoneNumber", "can't be blank"],
				["marketplaceDomainUrl", "can't be blank"],
				["claimEmailAddress", "can't be blank"],
				["claimPassword", "can't be blank"]
			]);
		})
		.checkElements({
			".control-group.error": 11
		}, assert);
});
