Balanced.ResultsTable = Ember.Mixin.create({
    needs: ['marketplace'],

    type: 'transaction',

    minDate: null,
    maxDate: null,
    dateFilterTitle: 'Any time',

    sortField: null,
    sortOrder: null,

    // override this to true if you want to use the search API to fetch results
    useSearch: false,

    // we use this so we can display counts without having them reset every time you filter
    last_loaded_search_result: null,

    // must be overridden to provide content if not using search
    results_base_uri: null,

    // must be overridden for data picker to work
    baseClassSelector: null,

    // override this and return a hash to add query params
    extra_filtering_params: null,

    // override this if you conditionally don't want to get results
    fetch_results: true,

    results: function() {
        if(!this.get('fetch_results')) {
            return null;
        }

        if(this.get('useSearch')) {
            return this.get('search_result.' + this.get('category') + 's');
        } else {
            return Balanced.ModelArray.newArrayLoadedFromUri(this.get('results_uri'), this.get('results_type'));
        }
    }.property('fetch_results', 'useSearch', 'results_uri', 'results_type', 'type', 'search_result.transactions', 'search_result.accounts', 'search_result.funding_instruments'),

    search_result: function() {
        var self = this;
        if(this.get('useSearch')) {
            var search = Balanced.SearchQuery.search(this.get('controllers.marketplace.uri'), this.get('search_params'));

            search.then(function (searchQuery) {
                self.set('last_loaded_search_result', searchQuery);
            });

            return search;
        } else {
            return null;
        }
    }.property('useSearch', 'controllers.marketplace.uri', 'search_params'),

    changeDateFilter: function (minDate, maxDate, title) {
        this.setProperties({
            minDate: minDate,
            maxDate: maxDate,
            dateFilterTitle: title
        });
    },

    changeSortOrder: function (field, sortOrder) {
        this.setProperties({
            sortField: field,
            sortOrder: sortOrder
        });
    },

    changeTypeFilter: function (type) {
        this.set('type', type);
    },

    getSearchUri: function () {
        if(this.get('useSearch')) {
            return Balanced.SearchQuery.createUri(this.get('controllers.marketplace.uri'), this.get('search_params'));
        } else {
            return this.get('results_uri');
        }
    },

    loadMore: function (results) {
        results.loadNextPage();
    },

    results_uri: function() {
        return Balanced.Utils.applyUriFilters(this.get('results_base_uri'), this.get('search_params'));
    }.property('type', 'minDate', 'maxDate', 'sortField', 'sortOrder', 'results_base_uri'),

    search_params: function() {
        return _.extend({
            type: this.get('type'),
            minDate: this.get('minDate'),
            maxDate: this.get('maxDate'),
            sortField: this.get('sortField'),
            sortOrder: this.get('sortOrder'),
            limit: this.get('limit')
        }, this.get('extra_filtering_params'));
    }.property('type', 'minDate', 'maxDate', 'sortField', 'sortOrder', 'limit', 'extra_filtering_params'),

    results_type: function() {
        switch(this.get('type')) {
            case 'transaction':
                return 'Balanced.Transaction';
            case 'debit':
                return 'Balanced.Debit';
            case 'credit':
                return 'Balanced.Credit';
            case 'hold':
                return 'Balanced.Hold';
            case 'refund':
                return 'Balanced.Refund';
            case 'account':
                return 'Balanced.Account';
            case 'customer':
                return 'Balanced.Customer';
            case 'funding_instrument':
                return 'Balanced.FundingInstrument';
            case 'bank_account':
                return 'Balanced.BankAccount';
            case 'card':
                return 'Balanced.Card';
            default:
                return null;
        }
    }.property('type'),

    // used for when filtering to one specific type. for example: if the user
    // is viewing holds, type==hold category==transaction
    category: function () {
        var type = this.get('type');
        if (_.contains(Balanced.SEARCH.CATEGORIES, type)) {
            return type;
        }

        if (_.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
            return "transaction";
        }

        if (_.contains(Balanced.SEARCH.FUNDING_INSTRUMENT_TYPES, type)) {
            return "funding_instrument";
        }

        return "";
    }.property('type')
});
