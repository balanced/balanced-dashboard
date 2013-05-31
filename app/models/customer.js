Balanced.Customer = Balanced.Model.extend({
	bank_accounts: Balanced.Model.hasMany('Balanced.BankAccount', 'bank_accounts_uri'),

    verified_bank_accounts: function() {
        var bank_accounts = this.get('bank_accounts');

        valid_bank_accounts = [];
        for(var i = 0; i < bank_accounts.length; i++) {
            if(bank_accounts[i].get('verified')) {
                valid_bank_accounts.push(bank_accounts[i]);
            }
        }

        return valid_bank_accounts;
    }.property('bank_accounts'),

    cards: Balanced.Model.hasMany('Balanced.Card', 'cards_uri')
});
