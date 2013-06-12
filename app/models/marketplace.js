Balanced.Marketplace = Balanced.MarketplaceLite.extend({
    credits: Balanced.Model.hasMany('Balanced.Credit', 'credits_uri'),
    debits: Balanced.Model.hasMany('Balanced.Debit', 'debits_uri'),
    refunds: Balanced.Model.hasMany('Balanced.Refund', 'refunds_uri'),
    holds: Balanced.Model.hasMany('Balanced.Hold', 'holds_uri'),
    callbacks: Balanced.Model.hasMany('Balanced.Callback', 'callbacks_uri'),

    bank_accounts: Balanced.Model.hasMany('Balanced.BankAccount', 'bank_accounts_uri'),
    cards: Balanced.Model.hasMany('Balanced.Card', 'cards_uri'),

    owner_account: Balanced.Model.belongsTo('Balanced.Account', 'owner_account_json', {embedded: true}),
    owner_customer: Balanced.Model.belongsTo('Balanced.Customer', 'owner_customer_json', {embedded: true}),

    callbacks_uri: function () {
        return this.get('uri') + '/callbacks';
    }.property('uri')
});

Balanced.Marketplace.reopenClass({
    deserialize: function (json) {
        json.owner_account_json = json.owner_account;
        delete json.owner_account;
        json.owner_customer_json = json.owner_customer;
        delete json.owner_customer;
    },
    serialize: function (json) {
        json.owner_account = json.owner_account_json;
        delete json.owner_account_json;
        json.owner_customer = json.owner_customer_json;
        delete json.owner_customer_json;
    },
    constructUri: function (id) {
        return '/v1/marketplaces/' + id;
    }
});
