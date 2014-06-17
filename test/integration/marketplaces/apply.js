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
		.then(assertInputsCount(18))
		.click('a:contains("Person")')
		.then(assertInputsCount(15));
});

test('basic form validation and terms and conditions', function(assert) {
	visit(Testing.APPLY_ROUTE)
		.click('a:contains("Person")')
		.checkElements({
			'button.submit': 1
		}, assert)
		.click('button.submit')
		.checkElements({
			'.control-group.error': 15
		}, assert)
		.click('#terms-and-conditions')
		.click('button.submit')
		.checkElements({
			'.control-group.error': 14
		}, assert);
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
			sinon.stub(model, "save");
			model.save.returns({
				then: function() {}
			});
			sinon.spy(model, "validate");
			assert.equal(model.get("user"), user);
		})
		.click('a:contains("Business")')
		.fillForm({
			businessName: "Balanced Inc",
			employerIdentificationNumber: '123456789',
			principalOwnerName: "Jim Box",

			personName: "John Balanced",
			socialSecurityNumber: "1234",
			streetAddress: "965 Mission St",
			postalCode: "94103",
			phoneNumber: "(904) 628 1796",
			dobYear: 1980,
			dobMonth: 5,
			dobDay: 27,

			incorporationDay: 4,
			incorporationYear: 2000,
			incorporationMonth: 12,

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
				name: "Balanced Inc",
				company_type: "llc",
				principal_owner_name: "Jim Box",
				incorporation_date: "2000-12-04",
				person: {
					dob: "1980-05-27",
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
			};

			assert.deepEqual(model.getBusinessApiKeyAttributes(), expectedApiKeysAttributes);
		});
});
