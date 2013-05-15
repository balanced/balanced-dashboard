/*
 * This wraps the results of a search query.
 */
Balanced.SearchQuery = Balanced.Model.extend({
});


Balanced.SearchQuery.reopenClass({
    deserialize: function (json) {

        var accountMap = {
                'account': Balanced.Account
            },
            transactionMap = {
                'credit': Balanced.Credit,
                'debit': Balanced.Debit,
                'refund': Balanced.Refund,
                'hold': Balanced.Hold
            },
            fundingInstrumentMap = {
                'card': Balanced.Card,
                'bank_account': Balanced.BankAccount
            };

        function itemFilter (map) {
            return function (item) {
                return Object.keys(map).indexOf(item._type) > -1;
            };
        }

        function itemMap (map) {
            return function (item) {
                var instance = map[item._type];
                if (instance) {
                    return instance.create(item);
                }
            };
        }

        json.accounts = _.chain(json.items).filter(itemFilter(accountMap)).map(itemMap(accountMap)).value();
        json.transactions = _.chain(json.items).filter(itemFilter(transactionMap)).map(itemMap(transactionMap)).value();
        json.funding_instruments = _.chain(json.items).filter(itemFilter(fundingInstrumentMap)).map(itemMap(fundingInstrumentMap)).value();

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
            q: params.query,
            requestTimeStamp: params.requestTimeStamp
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
                case 'funding_instrument':
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
