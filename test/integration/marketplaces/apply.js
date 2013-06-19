module('Balanced.Marketplaces.apply', {
    setup: function () {
        Ember.run(function () {
            Balanced.Router.create().transitionTo('marketplaces.apply');
        });
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
    type: 'CHECKING'
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

function confirm(assert, method, payload) {
    var controller = Balanced.__container__.lookup('controller:marketplacesApply');
    var parsedPayload = controller[method]();

    _.each(payload, function (value, key) {
        assert.equal(parsedPayload.get(key), value);
    });

}

test('we are on the correct page', function (assert) {
    assert.equal($('h1', '#marketplace-apply').text(), 'Apply for a Production Marketplace');
});

test('clicking business or personal shows data', function (assert) {
    function getInputs() {
        return $('input', '#marketplace-apply');
    }

    assert.equal(getInputs().length, 0);

    $('a:contains("Business")').click();
    assert.equal(getInputs().length, 15);

    $('a:contains("Person")').click();
    assert.equal(getInputs().length, 13);
});

test('business api key data is correctly extracted', function (assert) {
    $('a:contains("Business")').click();

    populate();
    confirm(assert, '_extractApiKeyPayload', expectedBusinessApiKeyData);
});

test('personal api key data is correctly extracted', function (assert) {
    $('a:contains("Person")').click();

    populate();
    confirm(assert, '_extractApiKeyPayload', expectedPersonalApiKeyData);
});

test('bank account data is correctly extracted', function (assert) {
    $('a:contains("Person")').click();

    populate();
    confirm(assert, '_extractBankAccountPayload', expectedBankAccountData);
});

test('marketplace data is correctly extracted', function (assert) {
    $('a:contains("Person")').click();

    populate();
    confirm(assert, '_extractMarketplacePayload', expectedMarketplaceData);
});

test('basic form validation and terms and conditions', function (assert) {
    $('a:contains("Person")').click();

    var $submitButton = $('button:contains("Submit")');
    assert.equal($submitButton.length, 1);

    $submitButton.click();
    assert.equal($('.control-group.error').length, 13, 'expected error fields highlighted');

    $('#terms-and-conditions').click();
    $submitButton.click();

    assert.equal($('.control-group.error').length, 12, 'expected error fields highlighted but not t&c');

});
