Balanced.Customer = Balanced.Model.extend({
	bank_accounts: Balanced.Model.hasMany('Balanced.BankAccount', 'bank_accounts_uri'),
    cards: Balanced.Model.hasMany('Balanced.Card', 'cards_uri'),

    type: function () {
        return (this.get('ein') && this.get('business_name')) ? 'Business': 'Person';
    }.property('ein', 'name')

});
