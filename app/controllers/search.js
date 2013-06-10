Balanced.SearchController = Balanced.ObjectController.extend(Balanced.DownloadControllerMixin, {
    needs: ['marketplace'],

    search: '',
    latestRequestTimeStamp: null,

    limit: 10,
    minDate: null,
    maxDate: null,
    sortField: null,
    sortOrder: null,
    isLoading: false,
    type: 'transactions',

    getLabel: function (labelMapping, acceptedTypes, type) {
        var label = labelMapping[type];
        if (!label && acceptedTypes.indexOf(type) > -1) {
            label = Balanced.Utils.toTitleCase(type.replace('_', ' ')) + 's';
        }
        return (label) ? label : labelMapping.DEFAULT;
    },

    transaction_type: function () {
        var types = ['debit', 'credit', 'hold', 'refund', 'transactions'];
        return types.indexOf(this.type) > -1 ? 'transactions' : null;
    }.property('content.type'),

    transaction_type_label: function () {
        var typesToLabels = {
            DEFAULT: 'Transactions'
        };
        var types = ['debit', 'credit', 'hold', 'refund'];
        return this.getLabel(typesToLabels, types, this.type);
    }.property('content.type'),

    transaction_type_total: function () {
        var types = ['debit', 'credit', 'hold', 'refund'];
        var type = this.get('type');
        return (types.indexOf(type) >= 0 && this.get('total_{0}s'.format(type))) || this.get('total_transactions');
    }.property('content.uri'),

    funding_instrument_type_label: function () {
        var typesToLabels = {
            DEFAULT: 'Cards & Bank Accounts'
        };
        var types = ['bank_account', 'card'];
        return this.getLabel(typesToLabels, types, this.type);
    }.property('content.type'),

    getSearchUri: function () {
        var query = this.get('search');
        var marketplaceUri = this.get('controllers').get('marketplace').get('uri');
        var params = this.searchParams({
            query: query
        });
        return Balanced.SearchQuery.createUri(marketplaceUri, params);
    },

    query: function (callback) {
        this.fromQuery(callback);
    },

    loadMoreSearchResults: function () {
        this.loadMoreFromQuery();
    },

    fromQuery: function (callback) {
        var query = this.get('search');
        var marketplaceUri = this.get('controllers').get('marketplace').get('uri');
        var requestTimeStamp = Ember.testing ? 0 : new Date().getTime();

        if (!query.trim()) {
            return;
        }

        // Allows users to get all results by entering wildcard (%)
        if (query === '%') {
            query = '';
        }

        this.set('latestRequestTimeStamp', requestTimeStamp);
        this.set('isLoading', true);

        var self = this;
        var params = this.searchParams({
            query: query,
            requestTimeStamp: requestTimeStamp
        });

        Balanced.SearchQuery.search(marketplaceUri, params, {
            observer: function (result) {
                self.onSearchCallback(result, callback);
            }
        });
    },

    searchParams: function (params) {
        var defaults = {
            limit: this.get('limit'),
            minDate: this.get('minDate'),
            maxDate: this.get('maxDate'),
            sortField: this.get('sortField'),
            sortOrder: this.get('sortOrder'),
            type: this.get('type')
        };
        return $.extend({}, defaults, params);
    },

    reset: function () {
        this.set('minDate', null);
        this.set('maxDate', null);
        this.set('sortField', null);
        this.set('sortOrder', null);
        this.set('search', null);
        this.set('type', 'transactions');
    },

    loadMoreFromQuery: function () {
        this.set('isLoading', true);

        var _this = this;

        Balanced.SearchQuery.find(this.get('content.next_uri'), {
            observer: function (result) {
                var exisitingTransactions = _this.get('content.transactions');
                var existingAccounts = _this.get('content.accounts');
                var existingFundingInstruments = _this.get('content.funding_instruments');

                exisitingTransactions.addObjects(result.transactions);
                existingAccounts.addObjects(result.accounts);
                existingFundingInstruments.addObjects(result.funding_instruments);

                _this.set('content.transactions', exisitingTransactions);
                _this.set('content.accounts', existingAccounts);
                _this.set('content.funding_instruments', existingFundingInstruments);
                _this.set('content.next_uri', result.get('next_uri'));

                _this.set('isLoading', false);
            }
        });
    },

    onSearchCallback: function (result, callback) {
        var requestTimeStamp = Balanced.Utils.getParamByName(result.uri, 'requestTimeStamp');
        if (requestTimeStamp !== 0 && +(requestTimeStamp) < +(this.get('latestRequestTimeStamp'))) {
            return;
        }

        this.set('content', result);
        this.set('isLoading', false);

        if (callback && typeof(callback) === 'function') {
            callback();
        }
    },

    changeDateFilter: function (minDate, maxDate) {
        this.set('minDate', minDate);
        this.set('maxDate', maxDate);
        this.query();
    },

    changeSortOrder: function (field, sortOrder) {
        this.set('sortField', field);
        this.set('sortOrder', sortOrder);
        this.query();
    },

    changeTypeFilter: function (type) {
        this.set('type', type || 'transactions');
    },

    selectSearchResult: function (uri) {
        window.location.hash = '#' + Balanced.Utils.uriToDashboardFragment(uri);
    },

    redirectToLog: function (ohm) {
        window.location = '#/marketplaces/{0}/logs/{1}'.format(
            this.get('controllers').get('marketplace').get('id'),
            ohm
        );
    },

    totalTransactionsHeader: function () {
        if (this.get('content')) {
            return 'Transactions (' + this.get('content').get('total_transactions') + ')';
        } else {
            return 'Transactions (0)';
        }

    }.property('content.total_transactions'),

    totalFundingInstrumentsHeader: function () {
        if (this.get('content')) {
            return 'Cards & Bank Accounts (' + this.get('content').get('total_funding_instruments') + ')';
        } else {
            return 'Cards & Bank Accounts (0)';
        }

    }.property('content.total_funding_instruments'),

    hasMoreResults: function () {
        if (this.get('content.next_uri') === null) {
            return false;
        }

        return true;
    }.property('content.next_uri')
});
