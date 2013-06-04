Balanced.BankAccount = Balanced.FundingInstrument.extend({
    uri: '/v1/bank_accounts',

    verifications: Balanced.Model.hasMany('Balanced.Verification', 'verifications_uri'),
    verification: Balanced.Model.belongsTo('Balanced.Verification', 'verification_uri'),

    type_name: function() {
        return 'Bank Account';
    }.property(),

    is_bank_account: true,

    description: function () {
        var acNum = this.get('account_number');
        return '{0} ({1})'.format(
            acNum.substr(acNum.length - 4),
            Balanced.Utils.toTitleCase(this.get('bank_name'))
        );
    }.property('account_number', 'bank_name'),

    verified: function() {
        return this.get('can_debit') || this.get('verification.state') === 'verified';
    }.property('verification.state')
});
