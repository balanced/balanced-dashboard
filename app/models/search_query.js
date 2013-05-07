/*
 * This wraps the results of a search query.
 */
Balanced.SearchQuery = Balanced.Model.extend({
});

Balanced.SearchQuery.reopenClass({
    deserialize: function(json) {
        json.accounts = _.chain(json.items)
            .filter(function(item) { return item._type === "account"; })
            .map(function(account) { return Balanced.Account.create(account) })
            .value();

        json.transactions = _.chain(json.items)
            .filter(function(item) { return item._type === "credit" || item._type === "debit" || item._type === "refund" || item._type === "hold"; })
            .map(function(transaction) {
                switch(transaction._type) {
                    case "credit":
                        return Balanced.Credit.create(transaction);
                    case "debit":
                        return Balanced.Debit.create(transaction);
                    case "refund":
                        return Balanced.Refund.create(transaction);
                    case "hold":
                        return Balanced.Hold.create(transaction);
                    default:
                        return null;
                }
            })
            .value();

        json.total_transactions = json.counts.refund + json.counts.credit + json.counts.debit + json.counts.hold;
        json.total_credits = json.counts.credit;
        json.total_debits = json.counts.debit;
        json.total_holds = json.counts.hold;
        json.total_refunds = json.counts.refund;

        json.total_accounts = json.counts.account;

        json.total_funding_instruments = json.counts.bank_account + json.counts.card;
        json.total_bank_accounts = json.counts.bank_account;
        json.total_cards = json.counts.card;
    }
});

Balanced.SearchQuery.search = function(marketplaceId, query) {
    var uri = '/v1/marketplaces/' + marketplaceId + '/search?q=' + query + '&limit=10&offset=0';
    return this.find(uri);
};
