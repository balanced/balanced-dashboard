Balanced.SearchController = Balanced.ObjectController.extend(Balanced.DownloadControllerMixin, {
    needs: ['marketplace'],

    search: '',
    debounced_search: '',

    limit: 10,
    minDate: null,
    maxDate: null,
    sortField: null,
    sortOrder: null,
    type: 'transaction',

    displayResults: false,

    init: function() {
        this._super();

        var self = this;
        var debouncedQuery = _.debounce(function() {
            // since this might get called after a timeout, make sure this
            // object is still valid (especially necessary for tests)
            if(!self.get('isDestroyed')) {
                self.query();
            }
        }, Balanced.THROTTLE);
        this.addObserver('search', debouncedQuery);
    },

    // Using a two-level system for the results content here because we don't
    // want to lose our results while we're loading a new query
    // The currently processing query is computed as loading_content, once it
    // has loaded successfully, it's set as content
    loading_content: function() {
        var query = this.get('debounced_search');
        var marketplaceUri = this.get('controllers').get('marketplace').get('uri');

        if (!query || !query.trim()) {
            return null;
        }

        // Allows users to get all results by entering wildcard (%)
        if (query === '%') {
            query = '';
        }

        var self = this;
        var params = this._searchParams({
            query: query
        });

        var searchQuery = Balanced.SearchQuery.search(marketplaceUri, params);

        searchQuery.then(function(searchQuery) {
            self.set('content', searchQuery);
            self.set('displayResults', true);
        });

        return searchQuery;
    }.property('debounced_search', 'limit', 'minDate', 'maxDate', 'sortField', 'sortOrder', 'type'),

    isLoading: function() {
        var current = this.get('loading_content');
        return current && !current.get('isLoaded');
    }.property('loading_content.isLoaded'),

    loadMore: function(results) {
        results.loadNextPage();
    },

    query: function() {
        var search = this.get('search');
        if(!search || search.length == 0) {
            this.closeSearch();
            return;
        }

        if (search.indexOf('OHM') === 0 && query.length > 30) {
            this.redirectToLog(search);
            return;
        }

        this.set('debounced_search', this.get('search'));
    },

    closeSearch: function() {
        this.reset();
    },

    reset: function () {
        this.set('minDate', null);
        this.set('maxDate', null);
        this.set('sortField', null);
        this.set('sortOrder', null);
        this.set('search', null);
        this.set('debounced_search', null);
        this.set('type', 'transaction');
        this.set('displayResults', false);
    },

    changeDateFilter: function (minDate, maxDate) {
        this.set('minDate', minDate);
        this.set('maxDate', maxDate);
    },

    changeSortOrder: function (field, sortOrder) {
        this.set('sortField', field);
        this.set('sortOrder', sortOrder);
    },

    changeTypeFilter: function (type) {
        this.set('type', type);
    },

    // For download mixin
    getSearchUri: function () {
        var query = this.get('search');
        var marketplaceUri = this.get('controllers').get('marketplace').get('uri');
        var params = this._searchParams({
            query: query
        });
        return Balanced.SearchQuery.createUri(marketplaceUri, params);
    },

    selectResult: function (uri) {
        this.closeSearch();
        window.location.hash = '#' + Balanced.Utils.uriToDashboardFragment(uri);
    },

    redirectToLog: function (ohm) {
        this.closeSearch();
        window.location = '#/marketplaces/{0}/logs/{1}'.format(
            this.get('controllers').get('marketplace').get('id'),
            ohm
        );
    },

    // used for when filtering to one specific type. for example: if the user
    // is viewing holds, type==hold category==transaction
    category: function() {
        var type = this.get('type');
        if(_.contains(Balanced.SEARCH.CATEGORIES, type)) {
            return type;
        }

        if(_.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
            return "transaction";
        }

        if(_.contains(Balanced.SEARCH.FUNDING_INSTRUMENT_TYPES, type)) {
            return "funding_instrument";
        }

        return "";
    }.property('type'),

    // internal functions

    _searchParams: function (params) {
        var defaults = {
            limit: this.get('limit'),
            minDate: this.get('minDate'),
            maxDate: this.get('maxDate'),
            sortField: this.get('sortField'),
            sortOrder: this.get('sortOrder'),
            type: this.get('type')
        };
        return $.extend({}, defaults, params);
    }
});
