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
        return this.get('uri') + "/callbacks";
    }.property('uri'),

    // computes the ID from the URI - exists only because of the auth system 
    // we're using. if we're trying to retrieve something that needs the 
    // marketplace ID but the marketplace hasn't been retrieved yet, need a 
    // way to get the ID to fill out the auth param
    // REMOVE THIS WHEN WE HAVE OAUTH
    id_from_uri: function () {
        var uri = this.get('uri');
        return uri.substring(uri.lastIndexOf("/") + 1);
    }.property('uri'),

    // TODO: this is a horrible hack since the API itself does not return the
    // secret. what's happening here is we are looking at the marketplace
    // objects returned by the auth service which *do* have secrets and mapping
    // them against the actual marketplace object. a better idea may be to
    // return the user_marketplace object.
    secret: function () {
        var self = this;
        var secret = null;
        _.each(Balanced.Auth.get('user').marketplaces, function (marketplace) {
            if (marketplace.id === self.get('id')) {
                secret = marketplace.secret;
                return false;
            }
        });
        return secret;
    }.property()
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
        return "/v1/marketplaces/" + id;
    }
});
