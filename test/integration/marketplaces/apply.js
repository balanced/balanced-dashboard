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
    'merchant.person.phone_number': businessData.phone_number
};

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

    $('a:contains("Personal")').click();
    assert.equal(getInputs().length, 13);
});

test('api key data is correctly extracted', function (assert) {
    $('a:contains("Business")').click();

    // populate fields
    _.each(businessData, function (value, key) {
        var $input = $('[name="' + key + '"]');
        $input.val(value);
        $input.find(':selected').removeAttr('selected');
        $input.find(':contains("' + value + '")').attr('selected', 'selected');
        $input.keyup();
    });

    var controller = Balanced.__container__.lookup('controller:marketplacesApply');
    var apiKeyPayload = controller._extractApiKeyPayload();

    _.each(expectedBusinessApiKeyData, function (value, key) {
        assert.equal(apiKeyPayload.get(key), value);
    });

});
