Balanced.SearchResults = Ember.Mixin.create({
    needs: ['marketplace'],

    search: '%',
    debounced_search: '%',
    default_search: '%',

    limit: 10,
    minDate: null,
    maxDate: null,
    sortField: null,
    sortOrder: null,
    type: 'transaction',

    dateFilterTitle: 'Any time',

    init: function () {
        this._super();

        var self = this;
        var debouncedQuery = _.debounce(function () {
            // since this might get called after a timeout, make sure this
            // object is still valid (especially necessary for tests)
            if (!self.get('isDestroyed')) {
                self.query();
            }
        }, Balanced.THROTTLE);
        this.addObserver('search', debouncedQuery);
    },

    // Using a two-level system for the results content here because we don't
    // want to lose our results while we're loading a new query
    // The currently processing query is computed as loading_content, once it
    // has loaded successfully, it's set as content
    // IMPORTANT - in order for this to refresh automatically, something has to be using
    // it, rather than content. The simplest way to do this is to use the isLoading
    // property to display a spinner
    loading_content: function () {
        var query = this.get('debounced_search');
        var marketplaceUri = this.get('controllers.marketplace.uri');

        if (!query || !query.trim()) {
            return null;
        }

        var self = this;
        var params = this._searchParams();

        var searchQuery = Balanced.SearchQuery.search(marketplaceUri, params);

        searchQuery.then(function (searchQuery) {
            self.set('content', searchQuery);
        });

        return searchQuery;
    }.property('controllers.marketplace.uri', 'debounced_search', 'limit', 'minDate', 'maxDate', 'sortField', 'sortOrder', 'type'),

    isLoading: function () {
        var current = this.get('loading_content');
        return current && !current.get('isLoaded');
    }.property('loading_content.isLoaded'),

    loadMore: function (results) {
        results.loadNextPage();
    },

    query: function () {
        var search = this.get('search');
        if (!search || search.length === 0) {
            this.reset();
            return;
        }

        if (search.indexOf('OHM') === 0 && search.length > 30) {
            this.redirectToLog(search);
            return;
        }

        this.set('debounced_search', this.get('search'));
    },

    reset: function () {
        var defaultSearch = this.get('default_search');
        this.setProperties({
            debounced_search: defaultSearch,
            search: defaultSearch,
            content: null,
            minDate: null,
            maxDate: null,
            sortField: null,
            sortOrder: null,
            type: 'transaction'
        });
    },

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

    // For download mixin
    getSearchUri: function () {
        var marketplaceUri = this.get('controllers').get('marketplace').get('uri');
        var params = this._searchParams();
        return Balanced.SearchQuery.createUri(marketplaceUri, params);
    },

    selectResult: function (obj) {
        if(obj.constructor == Balanced.Account) {
            obj = Balanced.Customer.find(Balanced.Customer.constructUri(obj.get('id')));
        }

        if (obj.constructor == Balanced.Customer) {
            this.transitionToRoute('customer', obj);
            return;
        }

        window.location.hash = '#' + Balanced.Utils.uriToDashboardFragment(obj.uri);
    },

    redirectToLog: function (ohm) {
        window.location = '#/marketplaces/{0}/logs/{1}'.format(
            this.get('controllers').get('marketplace').get('id'),
            ohm
        );
    },

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
    }.property('type'),

    // internal functions

    _searchParams: function (params) {
        params = params || {};
        var query = this.get('search');
        // Allows users to get all results by entering wildcard (%)
        if (query === '%') {
            query = '';
        }
        var defaults = {
            query: query,
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
