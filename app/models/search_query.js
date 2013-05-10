/*
 * This wraps the results of a search query.
 */
Balanced.SearchQuery = Balanced.Model.extend({
});


Balanced.SearchQuery.reopenClass({
    deserialize: function (json) {
        json.accounts = _.chain(json.items)
            .filter(function (item) { return item._type === 'account'; })
            .map(function (account) { return Balanced.Account.create(account); })
            .value();

        json.transactions = _.chain(json.items)
            .filter(function (item) {
                return ['credit', 'debit', 'refund', 'hold'].indexOf(item._type) > -1;
            }).map(function (transaction) {
                switch (transaction._type) {
                    case 'credit':
                        return Balanced.Credit.create(transaction);
                    case 'debit':
                        return Balanced.Debit.create(transaction);
                    case 'refund':
                        return Balanced.Refund.create(transaction);
                    case 'hold':
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
    },
    search: function (marketplaceUri, query, minDate, maxDate, sortField, sortOrder, type) {
        var params = {q: query, limit: 10, offset: 0};
        var uri = marketplaceUri + '/search?';
        if (minDate) {
            params['created_at>='] = minDate.toISOString();
        }
        if (maxDate) {
            params['created_at<='] = maxDate.toISOString();
        }
        if (type) {
            switch (type) {
                case 'transactions':
                    params['type[in]'] = 'credit,debit,refund,hold';
                    break;
                case 'funding_instruments':
                    params['type[in]'] = 'bank_account,card';
                    break;
                default:
                    params.type = type;

            }
        }
        if (sortField && sortOrder && sortOrder !== 'none') {
            params.sort = sortField + ',' + sortOrder;
        }
        var queryString = $.map(params,function (v, k) {
            return k + '=' + v;
        }).join('&');
        uri += encodeURI(queryString);
        return this.find(uri);
    }

});
