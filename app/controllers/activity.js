Balanced.ActivityController = Balanced.ObjectController.extend(Balanced.DownloadControllerMixin, Balanced.SearchResults, {
    needs: ['marketplace'],

    baseClassSelector: '#activity',

    changeTypeFilter: function (type) {
        this.set('type', type);
        if (type === 'transaction' || _.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
            this.transitionToRoute('activity.transactions');
        } else if (type === 'account') {
            this.transitionToRoute('activity.customers');
        } else if (type === 'funding_instrument' || _.contains(Balanced.SEARCH.FUNDING_INSTRUMENT_TYPES, type)) {
            this.transitionToRoute('activity.funding_instruments');
        }
    }
});

Balanced.NestedActivityResultsControllers = Balanced.ObjectController.extend({
    needs: ['marketplace', 'activity'],

    content: Ember.computed.alias('controllers.activity.content'),
    loading_content: Ember.computed.alias('controllers.activity.loading_content'),
    type: Ember.computed.alias('controllers.activity.type'),
    category: Ember.computed.alias('controllers.activity.category'),
    isLoading: Ember.computed.alias('controllers.activity.isLoading'),
    sortField: Ember.computed.alias('controllers.activity.sortField'),
    sortOrder: Ember.computed.alias('controllers.activity.sortOrder'),

    dateFilterTitle: Ember.computed.alias('controllers.activity.dateFilterTitle'),

    loadMore: function (results) {
        this.get('controllers.activity').loadMore(results);
    },

    changeSortOrder: function (field, sortOrder) {
        this.get('controllers.activity').changeSortOrder(field, sortOrder);
    },

    selectResult: function (uri) {
        this.get('controllers.activity').selectResult(uri);
    }
});

Balanced.ActivityTransactionsController = Balanced.NestedActivityResultsControllers.extend({
});

Balanced.ActivityCustomersController = Balanced.NestedActivityResultsControllers.extend({
});

Balanced.ActivityFundingInstrumentsController = Balanced.NestedActivityResultsControllers.extend({
});
