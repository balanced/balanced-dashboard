Balanced.MarketplacesApplyController = Balanced.ObjectController.extend({

    selectType: function (applicationType) {
        this.set('applicationType', applicationType);
        $('input:first', '#marketplace-apply').focus();
    },

    typeSelected: function () {
        return this.get('isBusiness') ? 'BUSINESS' : 'PERSON';
    }.property('applicationType'),

    isBusiness: function () {
        return this.get('applicationType') === 'business';
    }.property('applicationType'),

    isGuest: function () {
        return Balanced.Auth.get('isGuest');
    }.property(),

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

    userFailure: function () {
        console.log('userFailure', arguments);
    },

    apiKeyFailure: function () {
        console.log('apiKeyFailure', arguments);
    },

    marketplaceFailure: function () {
        console.log('marketplaceFailure', arguments);
    },

    submitApplication: function () {
        var model = this.get('content');

        if (model.validate()) {
            // TODO: persist the request to the server, this will ultimately
            // be several requests so we need to be prepared on all of them for
            // failure.
            var user = this._extractLoginPayload(),
                apiKey = this._extractApiKeyPayload(),
                marketplace = this._extractMarketplacePayload(),
                bankAccount = this._extractBankAccountPayload();

            user.one('becameInvalid', this.userFailure);
            user.one('becameError', this.userFailure);
            apiKey.one('becameInvalid', this.apiKeyFailure);
            apiKey.one('becameError', this.apiKeyFailure);
            marketplace.one('becameInvalid', this.marketplaceFailure);
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
//            console.log('failed');
//            console.log(this.get('content.validationErrors'));
        }
    },

    accountTypes: ['CHECKING', 'SAVINGS'],

    _extractApiKeyPayload: function () {
        var merchantType = this.get('typeSelected'),
            isBusiness = this.get('isBusiness');
        var person = isBusiness ? {
            name: this.get('name'),
            dob: this.get('dob'),
            street_address: this.get('address.street_address'),
            postal_code: this.get('address.postal_code'),
            tax_id: this.get('ssn_last4'),
            phone_number: this.get('phone_number')
        } : null;
        return Balanced.APIKey.create({
            uri: '/v1/api_keys',
            merchant: {
                type: merchantType,
                name: this.get(isBusiness ? 'business_name' : 'name'),
                street_address: this.get('address.street_address'),
                postal_code: this.get('address.postal_code'),
                tax_id: this.get(isBusiness ? 'ein' : 'ssn_last4'),
                dob: isBusiness ? null : this.get('dob'),
                phone_number: this.get('phone_number'),
                person: person
            }
        });
    },

    _extractMarketplacePayload: function (model) {
        return Balanced.Marketplace.create({
            uri: '/v1/marketplaces',
            name: this.get('marketplace.name'),
            support_email_address: this.get('marketplace.support_email_address'),
            support_phone_number: this.get('marketplace.support_phone_number'),
            domain_url: this.get('marketplace.domain_url')
        });
    },

    _extractLoginPayload: function (model) {
        if (Balanced.Auth.get('isGuest')) {
            return Balanced.User.create({
                uri: '/users',
                email_address: this.get('email_address'),
                password: this.get('password')
            });
        }
    },

    _extractBankAccountPayload: function () {
        return Balanced.BankAccount.create({
            uri: '/v1/bank_accounts',
            name: this.get('banking.account_name'),
            routing_number: this.get('banking.routing_number'),
            account_number: this.get('banking.account_number'),
            type: this.get('banking.account_type')
        });
    }
});

Balanced.ControlGroupFieldView = Balanced.View.extend({
    tagName: 'div',
    classNames: ['control-group'],
    classNameBindings: ['cssError:error'],
    layoutName: '_control_group_field',

    error: function (field, prefix) {
        var errors = this.get('controller.validationErrors.' + field + '.messages');
        if (errors) {
            var error = errors[0];
            if (error.indexOf(prefix) !== 0) {
                error = prefix + ' ' + error;
            }
            return error;
        }
    },

    cssError: function () {
        var field = this.get('field');
        return this.get('controller.validationErrors.' + field);
    }.property('controller.validationErrors.length'),

    value: function () {
        var field = this.get('field');
        return this.get('controller.content.' + field);
    }.property(),

    valueChange: function () {
        var field = this.get('field'),
            value = this.get('value');
        this.get('controller.content').set(field, value);
    }.observes('value'),

    labelForField: function () {
        var field = this.get('field');
        return this.error(field, field) || this.get('help');
    }.property('controller.validationErrors.length')
});
