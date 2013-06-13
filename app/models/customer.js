Balanced.Customer = Balanced.Model.extend({
    bank_accounts: Balanced.Model.hasMany('Balanced.BankAccount', 'bank_accounts_uri'),

    verified_bank_accounts: function () {
        var bank_accounts = this.get('bank_accounts');

        return _.filter(bank_accounts.get('content'), function (bank_account) {
            if (bank_account.get('verified')) {
                return bank_account;
            }
        });
    }.property('bank_accounts.@each.verified'),

    cards: Balanced.Model.hasMany('Balanced.Card', 'cards_uri'),

    type: function () {
        return (this.get('ein') && this.get('business_name')) ? 'Business' : 'Person';
    }.property('ein', 'business_name'),

    display_me: function () {
        return this.get('name') || this.get('id');
    }.property('name', 'id'),
});

Balanced.TypeMappings.addTypeMapping('customer', 'Balanced.Customer');
