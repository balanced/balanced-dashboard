/*
 * This wraps the results of a search query.
 */
Balanced.SearchQuery = Balanced.Model.extend({
    transactions: Balanced.Model.hasMany('Balanced.Transaction', 'transactions'),
    accounts: Balanced.Model.hasMany('Balanced.Account', 'accounts'),
    funding_instruments: Balanced.Model.hasMany('Balanced.FundingInstrument', 'funding_instruments'),

    deserialize: function (json) {
        this._super(json);

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

        function itemFilter(map) {
            return function (item) {
                return Object.keys(map).indexOf(item._type) > -1;
            };
        }

        var transactions = _.chain(json.items).filter(itemFilter(transactionMap)).value();
        var accounts = _.chain(json.items).filter(itemFilter(accountMap)).value();
        var funding_instruments = _.chain(json.items).filter(itemFilter(fundingInstrumentMap)).value();

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

        json.total_credits = json.counts.credit;
        json.total_debits = json.counts.debit;
        json.total_holds = json.counts.hold;
        json.total_refunds = json.counts.refund;

        json.total_accounts = json.counts.account;

        json.total_bank_accounts = json.counts.bank_account;
        json.total_cards = json.counts.card;

        json.total_transactions = json.total_credits + json.total_debits + json.total_holds + json.total_refunds;
        json.total_funding_instruments = json.total_bank_accounts + json.total_cards;
    }
});

Balanced.SearchQuery.reopenClass({
    search: function (marketplaceUri, params, options) {
        var uri = this.createUri(marketplaceUri, params);
        var res = this.find(uri, options);
        return res;
    },

    createUri: function (marketplaceUri, params) {
        var uri = marketplaceUri + '/search?';
        var searchParams = {
            limit: params.limit || 10,
            offset: params.offset || 0,
            q: params.query
        };
        if (params.requestTimeStamp) {
            searchParams.requestTimeStamp = params.requestTimeStamp;
        }
        if (params.sortOrder && params.sortField && !params.sort) {
            searchParams.sort = [params.sortField, params.sortOrder].join(',');
        }
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

        searchParams = Balanced.Utils.sortDict(searchParams);

        var queryString = $.map(searchParams,function (v, k) {
            return k + '=' + v;
        }).join('&');

        uri += encodeURI(queryString);
        return uri;
    }
});
