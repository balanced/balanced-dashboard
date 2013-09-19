Balanced.ActivityController = Balanced.ObjectController.extend(Balanced.ResultsTable, {
	needs: ['marketplace'],

	useSearch: true,

	sortField: 'created_at',
	sortOrder: 'desc',

	baseClassSelector: '#activity',

	actions: {
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
	},

	results_base_uri: function () {
		return this.get('controllers.marketplace').get('search_uri');
	}.property('controllers.marketplace.search_uri')
});

Balanced.NestedActivityResultsControllers = Balanced.ObjectController.extend({
	needs: ['marketplace', 'activity'],

	results: Ember.computed.alias('controllers.activity.results'),
	search_result: Ember.computed.alias('controllers.activity.search_result'),
	last_loaded_search_result: Ember.computed.alias('controllers.activity.last_loaded_search_result'),
	type: Ember.computed.alias('controllers.activity.type'),
	category: Ember.computed.alias('controllers.activity.category'),
	sortField: Ember.computed.alias('controllers.activity.sortField'),
	sortOrder: Ember.computed.alias('controllers.activity.sortOrder'),
	dateFilterTitle: Ember.computed.alias('controllers.activity.dateFilterTitle'),

	actions: {
		loadMore: function (results) {
			this.get('controllers.activity').send('loadMore', results);
		},

		changeSortOrder: function (field, sortOrder) {
			this.get('controllers.activity').send('changeSortOrder', field, sortOrder);
		}
	}
});

Balanced.ActivityTransactionsController = Balanced.NestedActivityResultsControllers.extend({
	allowSortByNone: false
});

Balanced.ActivityCustomersController = Balanced.NestedActivityResultsControllers.extend({
});

Balanced.ActivityFundingInstrumentsController = Balanced.NestedActivityResultsControllers.extend({
});
