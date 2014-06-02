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
			assert.equal($('#marketplace-apply h1').text(), 'Apply for a Production Marketplace');
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
		.then(assertInputsCount(15));
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
		.then(function() {
			assert.equal($('.control-group.error').length, 15, 'expected error fields highlighted');
		})
		.click('#terms-and-conditions')
		.click(submitButtonQuery)
		.then(function() {
			assert.equal($('.control-group.error').length, 14, 'expected error fields highlighted but not t&c');
		});
});

test('application submits properly', function(assert) {
	var user = Balanced.User.create();
	Balanced.Auth.setAuthProperties(
		true,
		user,
		true,
		true,
		false
	);

	var controller = Balanced.__container__.lookup('controller:marketplaces_apply');

	var model;

	visit(Testing.APPLY_ROUTE)
		.then(function() {
			model = controller.get("model");
			sinon.spy(model, "save");
			sinon.spy(model, "validate");
			assert.equal(model.get("user"), user);
		})
		.click('a:contains("Business")')
		.fillForm({
			businessName: "Balanced Inc",
			employerIdentificationNumber: '123456789',

			personName: "John Balanced",
			socialSecurityNumber: "1234",
			streetAddress: "965 Mission St",
			postalCode: "94103",
			phoneNumber: "(904) 628 1796",
			dobYear: 1980,
			dobMonth: 1,
			dobDay: 31,

			bankAccountName: "Balanced Inc",
			bankAccountNumber: "123123123",
			bankAccountType: "Savings",
			bankRoutingNumber: "321174851",

			marketplaceName: "Balanced Test Marketplace",
			supportEmailAddress: "support@balancedpayments.com",
			supportPhoneNumber: "(650) 555-4444",
			marketplaceDomainUrl: "https://www.balancedpayments.com/"
		}, {
			click: ['#terms-and-conditions', '.submit']
		})
		.then(function() {
			assert.ok(model.validate.calledOnce, "ProductionAccessRequest validation ran");
			assert.ok(model.save.calledOnce, "ProductionAccessRequest saved");

			var expectedApiKeysAttributes = {
				merchant: {
					name: "Balanced Inc",
					person: {
						dob: "1980-5-27",
						name: "John Balanced",
						phone_number: "(904) 628 1796",
						postal_code: "94103",
						street_address: "965 Mission St",
						tax_id: "1234"
					},
					phone_number: "(904) 628 1796",
					postal_code: "94103",
					street_address: "965 Mission St",
					tax_id: "123456789",
					type: "BUSINESS"
				}
			};

			var expectedMarketplaceAttributes = {
				name: "Balanced Test Marketplace",
				support_email_address: "support@balancedpayments.com",
				support_phone_number: "(650) 555-4444",
				domain_url: "https://www.balancedpayments.com/"
			};

			var expectedBankAccountAttributes = {
				account_type: "savings",
				name: "Balanced Inc",
				account_number: "123123123",
				routing_number: "321174851"
			};
		});
});
