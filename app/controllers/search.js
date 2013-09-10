Balanced.SearchController = Balanced.ObjectController.extend(
    Balanced.DownloadControllerMixin,
    Balanced.ResultsTable,
    {
        needs: ['application', 'marketplace'],

        useSearch: true,

        search: null,
        debounced_search: null,

        allowSortByNone: true,

        showResults: false,

        baseClassSelector: '#search',

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
            this.addObserver('search', Balanced.THROTTLE > 0 ? debouncedQuery : _.bind(this.query, this));

            // close the search result when we do a transition
            var router = this.get('container').lookup('router:main');
            router.addObserver('url', function () {
                self.closeSearch();
            });
        },

        fetch_results: function () {
            return this.get('debounced_search') && this.get('debounced_search').length > 0;
        }.property('debounced_search'),

        extra_filtering_params: function () {
            var query = this.get('debounced_search');

            if(query) {
                Balanced.Analytics.trackEvent('Search', {query: query});
            }

            if (query === '%') {
                query = '';
            }
            return {
                query: query
            };
        }.property('debounced_search'),

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
            this.set('showResults', true);
        },

        reset: function () {
            this.setProperties({
                debounced_search: null,
                search: null,
                minDate: null,
                maxDate: null,
                dateFilterTitle: 'Any time',
                sortField: null,
                sortOrder: null,
                type: 'transaction',
                last_loaded_search_result: null
            });
        },

        isLoading: function () {
            return this.get('fetch_results') && this.get('search_result') && !this.get('search_result.isLoaded');
        }.property('search_result.isLoaded'),

        displayResults: function () {
            return this.get('fetch_results') && this.get('showResults');
        }.property('fetch_results', 'showResults'),

        openSearch: function() {
            this.set('showResults', true);
        },

        closeSearch: function () {
            this.set('showResults', false);
        },

        clearSearch: function() {
            this.reset();
        },

        redirectToLog: function (ohm) {
            var self = this;

            var logUri = Balanced.Log.constructUri(ohm);
            Balanced.Log.find(logUri).then(function (log) {
                self.closeSearch();
                self.transitionToRoute('logs.log', log);
            });
        },

        // UI properties
        transactionsTabSelected: function () {
            return this.get('category') === "transaction";
        }.property('category'),

        customersTabSelected: function () {
            return this.get('category') === "account";
        }.property('category'),

        fundingInstrumentsTabSelected: function () {
            return this.get('category') === "funding_instrument";
        }.property('category')
    }
);
