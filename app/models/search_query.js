/*
 * This wraps the results of a search query.
 */
Balanced.SearchQuery = Balanced.Model.extend({
    transactions: Balanced.Model.hasMany('Balanced.Transaction', 'transactions'),
    accounts: Balanced.Model.hasMany('Balanced.Account', 'accounts'),
    funding_instruments: Balanced.Model.hasMany('Balanced.FundingInstrument', 'funding_instruments'),

    total_credits: function () {
        return this.get('counts.credit');
    }.property('counts.credit'),

    total_debits: function () {
        return this.get('counts.debit');
    }.property('counts.debit'),

    total_holds: function () {
        return this.get('counts.hold');
    }.property('counts.hold'),

    total_refunds: function () {
        return this.get('counts.refund');
    }.property('counts.refund'),

    total_accounts: function () {
        return this.get('counts.account');
    }.property('counts.account'),

    total_bank_accounts: function () {
        return this.get('counts.bank_account');
    }.property('counts.bank_account'),

    total_cards: function () {
        return this.get('counts.card');
    }.property('counts.card'),

    total_transactions: function () {
        return this.get('total_credits') + this.get('total_debits') + this.get('total_holds') + this.get('total_refunds');
    }.property('total_credits', 'total_debits', 'total_holds', 'total_refunds'),

    total_funding_instruments: function () {
        return this.get('total_bank_accounts') + this.get('total_cards');
    }.property('total_bank_accounts', 'total_cards'),

    deserialize: function (json) {
        this._super(json);

        var transactionTypes = ['credit', 'debit', 'refund', 'hold'];
        var fundingInstrumentTypes = ['card', 'bank_account'];

        function itemFilter(typesArray) {
            return function (item) {
                return _.contains(typesArray, item._type);
            };
        }

        var transactions = _.filter(json.items, itemFilter(transactionTypes));
        var accounts = _.filter(json.items, itemFilter(['account']));
        var funding_instruments = _.filter(json.items, itemFilter(fundingInstrumentTypes));

        function constructResults(items, json) {
            var results = {
                items: items
            };
            results.next_uri = items.length > 0 ? json.next_uri : null;
            results.total = items.length > 0 ? json.total : null;
            return results;
        }

        json.transactions = constructResults(transactions, json);
        json.accounts = constructResults(accounts, json);
        json.funding_instruments = constructResults(funding_instruments, json);
    }
});

Balanced.SearchQuery.reopenClass({
    search: function (marketplaceUri, params, options) {
        var uri = this.createUri(marketplaceUri, params);
        var res = this.find(uri, options);
        return res;
    },

    createUri: function (marketplaceUri, params) {
        var uri = marketplaceUri + '/search';
        uri = Balanced.Utils.applyUriFilters(uri, params);
        return uri;
    }
});
