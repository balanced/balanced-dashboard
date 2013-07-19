Balanced.SearchController = Balanced.ObjectController.extend(Balanced.DownloadControllerMixin, Balanced.ResultsTable, {
    needs: ['marketplace'],

    useSearch: true,

    search: null,
    debounced_search: null,

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
        this.addObserver('search', debouncedQuery);
    },

    fetch_results: function () {
        return this.get('debounced_search') && this.get('debounced_search').length > 0;
    }.property('debounced_search'),

    extra_filtering_params: function () {
        var query = this.get('debounced_search');
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
        return this.get('fetch_results');
    }.property('fetch_results'),

    closeSearch: function () {
        this.reset();
    },

    selectResult: function (obj) {
        this.closeSearch();

        // TODO - Using __container__ is not good, we should see if there's a better way to kick this up the chain
        // Let's see if this gets anything...
        // http://stackoverflow.com/questions/17751081/ember-js-propagate-event-up-the-controller-router-chain
        Balanced.__container__.lookup('router:main').send('selectResult', obj);
    },

    redirectToLog: function (ohm) {
        this.closeSearch();
        window.location = '#/marketplaces/{0}/logs/{1}'.format(
            this.get('controllers').get('marketplace').get('id'),
            ohm
        );
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
    }.property('category'),
});
