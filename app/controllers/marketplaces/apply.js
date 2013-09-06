Balanced.MarketplacesApplyController = Balanced.ObjectController.extend({

    isLoading: false,
    kycError: false,
    termsAndConditions: false,

    selectType: function (applicationType) {
        var cls = 'selected';
        this.set('applicationType', applicationType);
        $('input:text', '#marketplace-apply').filter(function () {
            return this.value === '';
        }).first().focus();
        $('a', '.application-type').removeClass(cls).parent().find('.' + applicationType.toLowerCase()).addClass(cls);
    },

    selectedType: function () {
        return this.get('applicationType');
    }.property('applicationType'),

    isBusiness: function () {
        return this.get('applicationType') === 'BUSINESS';
    }.property('applicationType'),

    isGuest: function () {
        return Balanced.Auth.get('isGuest');
    }.property('Balanced.Auth.isGuest'),

    dobYears: function () {
        var start = new Date().getFullYear() - 17;
        var years = Ember.A();
        for (var i = 0; i < 80; i++) {
            years.push(start - i);
        }
        return years;
    }.property(),

    dobMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

    dobDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],

    dob: function () {
        var values = [
            this.get('dob_year'),
            this.get('dob_month'),
            this.get('dob_day')
        ];
        values = $.map(values, function (value) {
            if (value) {
                return value;
            }
        });
        return values.join('-');
    }.property('dob_day', 'dob_month', 'dob_year'),

    userFailure: function (unparsedJson) {
        var self = this;
        var json = JSON.parse(unparsedJson);
        _.each(json, function (value, key) {
            self.get('validationErrors').add(key, 'invalid', null, value);
        });
        self.propertyDidChange('validationErrors');
        self.set('isLoading', false);
        self.highlightError();
    },

    apiKeyFailure: function (unparsedJson) {
        var self = this;
        var json = JSON.parse(unparsedJson);
        var errors = {};
        if (json.extras) {
            errors = json.extras;
        } else {
            if (json.description === 'KYC failed') {
                var kycKeys = [
                    'address.street_address',
                    'address.postal_code',
                    'dob_year',
                    'name',
                    'ssn_last4'
                ];

                _.each(kycKeys, function (value) {
                    errors[value] = 'Please check this entry';
                });

                self.set('kycError', true);
            }
        }
        _.each(errors, function (value, key) {
            self.get('validationErrors').add(key, 'invalid', null, value);
        });
        self.propertyDidChange('validationErrors');
        self.set('isLoading', false);
        self.highlightError();
    },

    marketplaceFailure: function (unparsedJson) {
        var self = this;
        var json = JSON.parse(unparsedJson);
        _.each(json.extras, function (value, key) {
            self.get('validationErrors').add('marketplace.%@'.fmt(key), 'invalid', null, value);
        });
        self.propertyDidChange('validationErrors');
        self.set('isLoading', false);
        self.highlightError();
    },

    submitApplication: function () {
        var model = this.get('content');
        var superError = 'error critical';
        var $termsAndConditionsControlGroup = $('#terms-and-conditions').closest('.control-group');
        $termsAndConditionsControlGroup.removeClass(superError);
        if (!this.get('termsAndConditions')) {
            $termsAndConditionsControlGroup.addClass(superError).focus();
        }
        if (model.validate() && this.get('termsAndConditions')) {
            this.set('kycError', false);
            this.set('isLoading', true);

            // persist the request to the server, this will ultimately
            // be several requests so we need to be prepared on all of them for
            // failure.
            var user = this._extractLoginPayload(),
                apiKey = this._extractApiKeyPayload(),
                marketplace = this._extractMarketplacePayload(),
                bankAccount = this._extractBankAccountPayload();

            if (user) {
                user.one('becameInvalid', $.proxy(this.userFailure, this));
                user.one('becameError', $.proxy(this.userFailure, this));
            }
            apiKey.one('becameInvalid', $.proxy(this.apiKeyFailure, this));
            apiKey.one('becameError', $.proxy(this.apiKeyFailure, this));
            marketplace.one('becameInvalid', $.proxy(this.marketplaceFailure, this));

            // create user (check for duplicate email address)
            // create api key (check for merchant underwrite failure)
            // create marketplace (should be no failure)
            // associate marketplace with user (should be no failure)
            // create bankAccount (possible failures but at this point we
            // should just swallow and send them to the marketplace management
            // page to re-add)
            this.send('signup', {
                user: user,
                apiKey: apiKey,
                marketplace: marketplace,
                bankAccount: bankAccount
            });
        } else {
            this.highlightError();
        }
    },

    highlightError: function () {
        $('input', '#marketplace-apply .control-group.error:first').focus();
    },

    accountTypes: ['CHECKING', 'SAVINGS'],

    _extractApiKeyPayload: function () {
        var merchantType = this.get('selectedType'),
            isBusiness = merchantType === 'BUSINESS';

        var person = isBusiness ? {
            name: this.get('name'),
            dob: this.get('dob'),
            street_address: this.get('address.street_address'),
            postal_code: this.get('address.postal_code'),
            tax_id: this.get('ssn_last4'),
            phone_number: this.get('phone_number')
        } : null;
        var apiKey = Balanced.APIKey.create({
            //  TODO: uri should come from API
            uri: '/v1/api_keys',
            merchant: {
                type: merchantType,
                name: this.get(isBusiness ? 'business_name' : 'name'),
                street_address: this.get('address.street_address'),
                postal_code: this.get('address.postal_code'),
                tax_id: this.get(isBusiness ? 'ein' : 'ssn_last4'),
                phone_number: this.get('phone_number')
            }
        });
        if (isBusiness) {
            apiKey.set('merchant.person', person);
        } else {
            apiKey.set('merchant.dob', this.get('dob'));
        }
        return apiKey;
    },

    _extractMarketplacePayload: function () {
        return Balanced.Marketplace.create({
            //  TODO: uri should come from API
            uri: '/v1/marketplaces',
            name: this.get('marketplace.name'),
            support_email_address: this.get('marketplace.support_email_address'),
            support_phone_number: this.get('marketplace.support_phone_number'),
            domain_url: this.get('marketplace.domain_url')
        });
    },

    _extractLoginPayload: function () {
        if (Balanced.Auth.get('isGuest')) {
            return Balanced.Claim.create({
                uri: '/users',
                email_address: this.get('email_address'),
                password: this.get('password'),
                passwordConfirm: this.get('password')
            });
        }
    },

    _extractBankAccountPayload: function () {
        return Balanced.BankAccount.create({
            //  TODO: uri should come from API
            uri: '/v1/bank_accounts',
            name: this.get('banking.account_name'),
            routing_number: this.get('banking.routing_number'),
            account_number: this.get('banking.account_number'),
            type: this.get('banking.account_type')
        });
    }
});
