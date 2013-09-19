var applyRoute = '/marketplaces/apply';

module('Balanced.Marketplaces.apply', {
	setup: function () {
	}, teardown: function () {
	}
});

var businessData = {
	business_name: 'Balanced Inc',
	ein: '123456789',
	name: 'John Balanced',
	dob_day: 27,
	dob_month: 5,
	dob_year: 1980,
	'address.street_address': '965 Mission St',
	'address.postal_code': '94103',
	'ssn_last4': '1234',
	'phone_number': '(904) 628 1796',
	'banking.account_name': 'Balanced Inc',
	'banking.routing_number': '321174851',
	'banking.account_number': '123123123',
	'marketplace.name': 'Balanced Test Marketplace',
	'marketplace.support_email_address': 'support@balancedpayments.com',
	'marketplace.support_phone_number': '(650) 555-4444',
	'marketplace.domain_url': 'https://www.balancedpayments.com'
};

var expectedBusinessApiKeyData = {
	'merchant.name': businessData.business_name,
	'merchant.tax_id': businessData.ein,
	'merchant.phone_number': businessData.phone_number,
	'merchant.postal_code': businessData['address.postal_code'],
	'merchant.street_address': businessData['address.street_address'],
	'merchant.person.tax_id': businessData.ssn_last4,
	'merchant.person.street_address': businessData['address.street_address'],
	'merchant.person.postal_code': businessData['address.postal_code'],
	'merchant.person.phone_number': businessData.phone_number,
	'merchant.person.name': businessData.name
};

var expectedPersonalApiKeyData = {
	'merchant.name': businessData.name,
	'merchant.tax_id': businessData.ssn_last4,
	'merchant.phone_number': businessData.phone_number,
	'merchant.postal_code': businessData['address.postal_code'],
	'merchant.street_address': businessData['address.street_address']
};

var expectedMarketplaceData = {
	name: businessData['marketplace.name'],
	support_phone_number: businessData['marketplace.support_phone_number'],
	support_email_address: businessData['marketplace.support_email_address'],
	domain_url: businessData['marketplace.domain_url']
};

var expectedBankAccountData = {
	name: businessData['banking.account_name'],
	routing_number: businessData['banking.routing_number'],
	account_number: businessData['banking.account_number'],
	type: 'checking'
};

function populate() {
	_.each(businessData, function (value, key) {
		var $input = $('[name="' + key + '"]');
		$input.val(value);
		$input.find(':selected').removeAttr('selected');
		$input.find(':contains("' + value + '")').attr('selected', 'selected');
		$input.keyup();
	});
}

test('we are on the correct page', function (assert) {
	visit(applyRoute).then(function() {
		assert.equal($('h1', '#marketplace-apply').text(), 'Apply for a Production Marketplace');
	});
});

test('clicking business or personal shows data', function (assert) {
	visit(applyRoute).then(function() {
		function getInputs() {
			return $('input', '#marketplace-apply');
		}

		assert.equal(getInputs().length, 0);

		$('a:contains("Business")').click();
		assert.equal(getInputs().length, 15);

		$('a:contains("Person")').click();
		assert.equal(getInputs().length, 13);
	});
});

test('basic form validation and terms and conditions', function (assert) {
	visit(applyRoute).then(function() {
		$('a:contains("Person")').click();

		var $submitButton = $('button:contains("Submit")');
		assert.equal($submitButton.length, 1);

		$submitButton.click();
		assert.equal($('.control-group.error').length, 13, 'expected error fields highlighted');

		$('#terms-and-conditions').click();
		$submitButton.click();

		assert.equal($('.control-group.error').length, 12, 'expected error fields highlighted but not t&c');
	});
});

test('application submits properly', function(assert) {
	var createStub = sinon.stub(Balanced.Adapter, "create");
	var balancedInitStub = sinon.stub(balanced, "init");
	var tokenizingStub = sinon.stub(balanced.bankAccount, "create");
	createStub.withArgs(Balanced.APIKey).callsArgWith(3, {

	});
	createStub.withArgs(Balanced.Marketplace).callsArgWith(3, {
		owner_customer: {
			bank_accounts_uri: "/v1/marketplaces/deadbeef/bank_accounts"
		}
	});
	createStub.withArgs(Balanced.UserMarketplace).callsArgWith(3, {

	});
	createStub.withArgs(Balanced.BankAccount).callsArgWith(3, {
		verifications_uri: "/v1/bank_accounts/deadbeef/verifications"
	});
	createStub.withArgs(Balanced.Verification).callsArgWith(3, {

	});

	tokenizingStub.callsArgWith(1, {
		status: 201,
		data: {
			uri: "/v1/bank_accounts/deadbeef"
		}
	});

	visit(applyRoute)
	.click('a:contains("Person")')
	.then(function() {
		populate();
	})
	.click("#terms-and-conditions")
	.click('.submit')
	.then(function() {
		assert.equal(createStub.callCount, 5);
		assert.ok(createStub.calledWith(Balanced.APIKey, '/v1/api_keys', {
			merchant: {
				dob: '1996-1-1',
				name: 'John Balanced',
				phone_number: '(904) 628 1796',
				postal_code: '94103',
				street_address: '965 Mission St',
				tax_id: '1234',
				type: 'PERSON'
			}
		}));
		assert.ok(createStub.calledWith(Balanced.Marketplace, "/v1/marketplaces", {
			name: "Balanced Test Marketplace",
			support_email_address: "support@balancedpayments.com",
			support_phone_number: "(650) 555-4444",
			domain_url: "https://www.balancedpayments.com"
		}));
		assert.ok(createStub.calledWith(Balanced.UserMarketplace));
		assert.ok(createStub.calledWith(Balanced.BankAccount, '/v1/marketplaces/deadbeef/bank_accounts', {
			bank_account_uri: '/v1/bank_accounts/deadbeef'
		}));
		assert.ok(createStub.calledWith(Balanced.Verification, '/v1/bank_accounts/deadbeef/verifications'));

		assert.ok(balancedInitStub.calledOnce);
		assert.ok(balancedInitStub.calledWith('/v1/marketplaces'));
		assert.ok(tokenizingStub.calledOnce);
		assert.ok(tokenizingStub.calledWith({
			type: "checking",
			name: "Balanced Inc",
			account_number: "123123123",
			routing_number: "321174851"
		}));
	});
});
