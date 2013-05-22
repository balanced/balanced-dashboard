Balanced.Marketplace = Balanced.MarketplaceLite.extend({
    credits: Balanced.Model.hasMany('Balanced.Credit', 'credits_uri'),
    debits: Balanced.Model.hasMany('Balanced.Debit', 'debits_uri'),
    refunds: Balanced.Model.hasMany('Balanced.Refund', 'refunds_uri'),
    holds: Balanced.Model.hasMany('Balanced.Hold', 'holds_uri'),

    bank_accounts: Balanced.Model.hasMany('Balanced.BankAccount', 'bank_accounts_uri'),
    cards: Balanced.Model.hasMany('Balanced.Card', 'cards_uri'),

    owner_account: Balanced.Model.belongsTo('Balanced.Account', 'owner_account_json', {embedded: true})
});

Balanced.Marketplace.reopenClass({
    deserialize: function (json) {
    	json.owner_account_json = json.owner_account;
    	delete json.owner_account;
    },
    constructUri: function(id) {
        return "/v1/marketplaces/" + id;
    }
});
