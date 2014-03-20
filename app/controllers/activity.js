Balanced.ActivityController = Balanced.ObjectController.extend(Balanced.ResultsTable, {
	needs: ['marketplace'],

	sortField: 'created_at',
	sortOrder: 'desc',
	limit: 50,

	baseClassSelector: '#activity',
	noDownloadsUri: true,

	transactionStatus: 'all',

	TYPE_TRANSLATION: {
		'card_hold': 'hold'
	},

	refreshMarketplace: _.debounce(function() {
		if (!Balanced.currentMarketplace) {
			return;
		}

		Ember.run(function() {
			Balanced.currentMarketplace.reload();
		});
	}, Balanced.THROTTLE.REFRESH),

	refresh: function() {
		this.refreshMarketplace();
	},

	actions: {
		changeTypeFilter: function(type) {
			this._super(type);

			if (type === 'transaction' || _.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
				this.transitionToRoute('activity.transactions');
			} else if (type === 'order') {
				this.transitionToRoute('activity.orders');
			} else if (type === 'customer') {
				this.transitionToRoute('activity.customers');
			} else if (type === 'funding_instrument' || _.contains(Balanced.SEARCH.FUNDING_INSTRUMENT_TYPES, type)) {
				this.transitionToRoute('activity.funding_instruments');
			} else if (type === 'dispute' || _.contains(Balanced.SEARCH.DISPUTE_TYPES, type)) {
				this.transitionToRoute('activity.disputes');
			}

			this.refresh();
		}
	},

	extra_filtering_params: function() {
		var transactionStatus = this.get('transactionStatus');
		var type = this.get('type');

		if (type !== 'transaction' && !_.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
			return {};
		}

		if (transactionStatus === 'all') {
			return {
				'status[in]': 'failed,succeeded,pending'
			};
		}

		return {
			status: transactionStatus
		};
	}.property('type', 'transactionStatus'),

	results_base_uri: function() {
		var type = this.get('type');

		if (type === 'dispute') {
			return '/disputes';
		} else if (type === 'transaction' || _.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
			return '/transactions';
		}

		return this._super();
	}.property('type', 'controllers.marketplace.uri')
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
	isLoaded: Ember.computed.alias('controllers.activity.isLoaded'),
	allowSortByNone: Ember.computed.alias('controllers.activity.allowSortByNone'),

	actions: {
		loadMore: function(results) {
			this.get('controllers.activity').send('loadMore', results);
		},

		changeSortOrder: function(field, sortOrder) {
			this.get('controllers.activity').send('changeSortOrder', field, sortOrder);
		},

		changeTypeFilter: function(type) {
			this.get('controllers.activity').send('changeTypeFilter', type);
		}
	}
});

Balanced.ActivityTransactionsController = Balanced.NestedActivityResultsControllers.extend({
	noDownloadsUri: true,

	transactionStatus: Ember.computed.alias('controllers.activity.transactionStatus'),
	transactionTypeFilter: Ember.computed.alias('controllers.activity.transactionTypeFilter'),

	actions: {
		changeTransactionStatusFilter: function(status) {
			this.set('controllers.activity.transactionStatus', status);
		}
	}
});

Balanced.ActivityDisputesController = Balanced.NestedActivityResultsControllers.extend({});

Balanced.ActivityOrdersController = Balanced.NestedActivityResultsControllers.extend({});

Balanced.ActivityCustomersController = Balanced.NestedActivityResultsControllers.extend({});

Balanced.ActivityFundingInstrumentsController = Balanced.NestedActivityResultsControllers.extend({});
