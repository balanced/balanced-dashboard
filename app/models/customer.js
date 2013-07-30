Balanced.Customer = Balanced.Model.extend({
    bank_accounts: Balanced.Model.hasMany('Balanced.BankAccount', 'bank_accounts_uri'),
    cards: Balanced.Model.hasMany('Balanced.Card', 'cards_uri'),
    transactions: Balanced.Model.hasMany('Balanced.Transaction', 'transactions_uri'),
    debits: Balanced.Model.hasMany('Balanced.Debit', 'debits_uri'),
    credits: Balanced.Model.hasMany('Balanced.Credit', 'credits_uri'),
    holds: Balanced.Model.hasMany('Balanced.Hold', 'holds_uri'),
    refunds: Balanced.Model.hasMany('Balanced.Refund', 'refunds_uri'),

    debitable_bank_accounts: function () {
        var bank_accounts = this.get('bank_accounts');

        return _.filter(bank_accounts.get('content'), function (bank_account) {
            if (bank_account.get('can_debit')) {
                return bank_account;
            }
        });
    }.property('bank_accounts.@each.can_debit'),

    debitable_funding_instruments: function () {
        return this.get('debitable_bank_accounts').concat(this.get('cards.content'));
    }.property('debitable_bank_accounts', 'cards'),

    type: function () {
        return (this.get('ein') && this.get('business_name')) ? 'Business' : 'Person';
    }.property('ein', 'business_name'),

    is_business: function () {
        return this.get('type') === 'Business';
    }.property('type'),

    is_person: function () {
        return this.get('type') === 'Person';
    }.property('type'),

    display_me: function () {
        return this.get('name') || this.get('id');
    }.property('name', 'id'),

    facebook_url: function () {
        if (this.get('facebook')) {
            return 'http://facebook.com/profile.php?id=' + this.get('facebook');
        } else {
            return undefined;
        }
    }.property('facebook'),

    twitter_url: function () {
        if (this.get('twitter')) {
            return 'http://twitter.com/#/' + this.get('twitter');
        } else {
            return undefined;
        }
    }.property('twitter'),

    dob_month: function () {
        var dob = this.get('dob');
        if (dob && dob.length > 6) {
            return dob.substring(5, 7);
        } else {
            return null;
        }
    }.property('dob'),

    dob_year: function () {
        var dob = this.get('dob');
        if (dob && dob.length > 3) {
            return dob.substring(0, 4);
        } else {
            return null;
        }
    }.property('dob'),

    displayName: function () {
        var name;
        if (this.get('is_business')) {
            name = this.get('business_name');
        } else {
            name = this.get('name');
        }
        var email = this.get('email');
        if (name) {
            if (email) {
                name += ' ({0})'.format(email);
            }
        } else {
            name = email;
        }
        return name;
    }.property('is_business', 'business_name', 'name', 'email'),

    updateDob: function(month, year) {
        if ((month && month.length > 0) || (year && year.length > 0)) {
            this.set('dob', year + '-' + month);
        } else {
            this.set('dob', null);
        }
    }
});

Balanced.TypeMappings.addTypeMapping('customer', 'Balanced.Customer');
