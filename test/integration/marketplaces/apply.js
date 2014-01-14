module('Balanced.Marketplaces.apply', {
	setup: function() {

		Testing.APPLY_ROUTE = '/marketplaces/apply';

		Ember.run(function() {
			// Set up Ember Auth with some BS values
			Balanced.Auth.setAuthProperties(
				true,
				Balanced.User.create(),
				true,
				true,
				false);
		});

		if (balanced.bankAccount.create.restore) {
			balanced.bankAccount.create.restore();
		}
		if (Balanced.Adapter.create.restore) {
			Balanced.Adapter.create.restore();
		}
	},
	teardown: function() {
		if (balanced.bankAccount.create.restore) {
			balanced.bankAccount.create.restore();
		}
		if (Balanced.Adapter.create.restore) {
			Balanced.Adapter.create.restore();
		}
	}
});

test('we are on the correct page', function(assert) {
	visit(Testing.APPLY_ROUTE)
		.then(function() {
			assert.equal($('h1', '#marketplace-apply').text(), 'Apply for a Production Marketplace');
		});
});

test('clicking business or personal shows data', function(assert) {
	visit(Testing.APPLY_ROUTE)
		.then(function() {
			assert.equal($('input', '#marketplace-apply').length, 0);
		})
		.click('a:contains("Business")')
		.then(function() {
			assert.equal($('input', '#marketplace-apply').length, 15);
		})
		.click('a:contains("Person")')
		.then(function() {
			assert.equal($('input', '#marketplace-apply').length, 13);
		});
});

test('basic form validation and terms and conditions', function(assert) {
	visit(Testing.APPLY_ROUTE)
		.then(function() {
			click('a:contains("Person")');

			var $submitButton = $('button:contains("Submit")');
			assert.equal($submitButton.length, 1);

			click($submitButton);
			assert.equal($('.control-group.error').length, 13, 'expected error fields highlighted');

			click('#terms-and-conditions');
			click($submitButton);

			assert.equal($('.control-group.error').length, 12, 'expected error fields highlighted but not t&c');
		});
});

test('application submits properly', function(assert) {
	var createStub = sinon.stub(Balanced.Adapter, "create");
	var tokenizingStub = sinon.stub(balanced.bankAccount, "create");

	createStub.withArgs(Balanced.APIKey).callsArgWith(3, {

	});
	createStub.withArgs(Balanced.Marketplace).callsArgWith(3, {
		owner_customer: [{
			bank_accounts_uri: "/marketplaces/deadbeef/bank_accounts"
		}]
	});
	createStub.withArgs(Balanced.UserMarketplace).callsArgWith(3, {

	});
	createStub.withArgs(Balanced.BankAccount).callsArgWith(3, {
		bank_account_verifications_uri: "/bank_accounts/deadbeef/verifications"
	});
	createStub.withArgs(Balanced.Verification).callsArgWith(3, {

	});

	tokenizingStub.callsArgWith(1, {
		status: 201,
		bank_accounts: [{
			href: "/bank_accounts/deadbeef"
		}]
	});

	visit(Testing.APPLY_ROUTE)
		.click('a:contains("Business")')
		.fillIn('input[name="business_name"]', 'Balanced Inc')
		.fillIn('input[name="ein"]', '123456789')
		.fillIn('input[name="name"]', 'John Balanced')
		.fillIn('select[name="dob_year"]', '1980')
		.fillIn('select[name="dob_month"]', '5')
		.fillIn('select[name="dob_day"]', '27')
		.fillIn('input[name="address.street_address"]', '965 Mission St')
		.fillIn('input[name="address.postal_code"]', '94103')
		.fillIn('input[name="ssn_last4"]', '1234')
		.fillIn('input[name="phone_number"]', '(904) 628 1796')
		.fillIn('input[name="banking.account_name"]', 'Balanced Inc')
		.fillIn('input[name="banking.routing_number"]', '321174851')
		.fillIn('input[name="banking.account_number"]', '123123123')
		.fillIn('input[name="marketplace.name"]', 'Balanced Test Marketplace')
		.fillIn('input[name="marketplace.support_email_address"]', 'support@balancedpayments.com')
		.fillIn('input[name="marketplace.support_phone_number"]', '(650) 555-4444')
		.fillIn('input[name="marketplace.domain_url"]', 'https://www.balancedpayments.com')
		.click("#terms-and-conditions")
		.click('.submit')
		.then(function() {
			assert.equal(createStub.callCount, 3);
			assert.ok(createStub.calledWith(Balanced.APIKey, '/api_keys', sinon.match({
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
			})));
			assert.ok(createStub.calledWith(Balanced.Marketplace, "/marketplaces", sinon.match({
				name: "Balanced Test Marketplace",
				support_email_address: "support@balancedpayments.com",
				support_phone_number: "(650) 555-4444",
				domain_url: "https://www.balancedpayments.com"
			})));

			assert.ok(createStub.calledWith(Balanced.UserMarketplace));

			// using balanced.js to create the bank account
			assert.ok(tokenizingStub.calledOnce);
			assert.ok(tokenizingStub.calledWith({
				type: "checking",
				name: "Balanced Inc",
				account_number: "123123123",
				routing_number: "321174851"
			}));

			balanced.bankAccount.create.restore();
		});
});
