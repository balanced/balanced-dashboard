Balanced.Marketplace = Balanced.MarketplaceLite.extend({
    credits: Balanced.Model.hasMany('Balanced.Credit', 'credits_uri'),
    debits: Balanced.Model.hasMany('Balanced.Debit', 'debits_uri'),
    refunds: Balanced.Model.hasMany('Balanced.Refund', 'refunds_uri'),
    holds: Balanced.Model.hasMany('Balanced.Hold', 'holds_uri'),
    transactions: Balanced.Model.hasMany('Balanced.Transaction', 'transactions_uri'),
    callbacks: Balanced.Model.hasMany('Balanced.Callback', 'callbacks_uri'),

    funding_instruments: Balanced.Model.hasMany('Balanced.FundingInstrument', 'funding_instruments_uri'),
    bank_accounts: Balanced.Model.hasMany('Balanced.BankAccount', 'bank_accounts_uri'),
    cards: Balanced.Model.hasMany('Balanced.Card', 'cards_uri'),

    owner_account: Balanced.Model.belongsTo('Balanced.Account', 'owner_account'),
    owner_customer: Balanced.Model.belongsTo('Balanced.Customer', 'owner_customer'),

    customers: Balanced.Model.hasMany('Balanced.Customer', 'customers_uri'),

    callbacks_uri: function () {
        return this.get('uri') + '/callbacks';
    }.property('uri'),

    funding_instruments_uri: function () {
        return this.get('uri') + '/search?limit=10&offset=0&q=&type[in]=bank_account,card';
    }.property('uri')
});

Balanced.Marketplace.reopenClass({
    constructUri: function (id) {
        return '/v1/marketplaces/' + id;
    },

    current: function () {
        var marketplace = Balanced.Marketplace.create({
            uri: '/v1/marketplaces'
        });
        Balanced.Marketplace.find('/v1/marketplaces').then(function (marketplaces) {
            marketplace._updateFromJson(marketplaces.items[0]);
        });

        return marketplace;

    }
});

Balanced.TypeMappings.addTypeMapping('marketplace', 'Balanced.Marketplace');
