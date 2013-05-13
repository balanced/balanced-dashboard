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
    search: function (marketplaceUri, params, options) {
        var uri = marketplaceUri + '/search?';
        var searchParams = {
            limit: params.limit || 10,
            offset: params.offset || 0,
            sortOrder: params.sortOrder || 'desc',
            sortField: params.sortField || 'created_at',
            q: params.query
        };
        if (params.minDate) {
            searchParams['created_at[>]'] = params.minDate.toISOString();
        }
        if (params.maxDate) {
            searchParams['created_at[<]'] = params.maxDate.toISOString();
        }
        if (params.type) {
            switch (params.type) {
                case 'transactions':
                    searchParams['type[in]'] = 'credit,debit,refund,hold';
                    break;
                case 'funding_instruments':
                    searchParams['type[in]'] = 'bank_account,card';
                    break;
                default:
                    searchParams.type = params.type;

            }
        }

        if (params.sortField && params.sortOrder && params.sortOrder !== 'none') {
            searchParams.sort = params.sortField + ',' + params.sortOrder;
        }

        var queryString = $.map(searchParams, function (v, k) {
            return k + '=' + v;
        }).join('&');

        uri += encodeURI(queryString);
        var res = this.find(uri, options);
        return res;
    }
});
