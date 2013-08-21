Balanced.BankAccount = Balanced.FundingInstrument.extend({
    uri: '/v1/bank_accounts',

    verifications: Balanced.Model.hasMany('verifications', 'Balanced.Verification'),
    verification: Balanced.Model.belongsTo('verification', 'Balanced.Verification'),

    type_name: function () {
        return 'Bank Account';
    }.property(),

    is_bank_account: true,

    last_four: function() {
        var accountNumber = this.get('account_number');
        if(!accountNumber || accountNumber.length < 5) {
            return accountNumber;
        } else {
            return accountNumber.substr(accountNumber.length-4,4)
        }
    }.property('account_number'),

    description: function () {
        if (this.get('bank_name')) {
            return '{0} ({1})'.format(
                this.get('last_four'),
                Balanced.Utils.toTitleCase(this.get('bank_name'))
            );
        } else {
            return this.get('last_four');
        }
    }.property('last_four', 'bank_name'),

    can_verify: function () {
        return !this.get('can_debit') &&
            (this.get('customer') || this.get('account'));
    }.property('can_debit', 'can_confirm_verification'),

    can_confirm_verification: function () {
        return this.get('verification') &&
                this.get('verification.state') !== 'failed' &&
                this.get('verification.state') !== 'verified' &&
                this.get('verification.remaining_attempts') > 0;
    }.property('verification', 'verification.state', 'verification.remaining_attempts')
});

Balanced.TypeMappings.addTypeMapping('bank_account', 'Balanced.BankAccount');
