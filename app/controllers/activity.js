Balanced.ActivityController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, Balanced.TransactionsTable, {
	needs: ['marketplace'],

	sortField: 'created_at',
	sortOrder: 'desc',
	limit: 50,

	baseClassSelector: '#activity',
	noDownloadsUri: true,

	transactionStatus: 'all',

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
		openPaySellerModal: function() {
			this.trigger('openPaySellerModal');
		},

		openChargeCardModal: function() {
			this.trigger('openChargeCardModal');
		},

		changeTypeFilter: function(type) {
			this._super(type);

			if (type === 'transaction' || _.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
				this.transitionToRoute('activity.transactions');
			} else if (type === 'order') {
				this.transitionToRoute('activity.orders');
			}

			this.refresh();
		},

		openAddFundsModal: function() {
			this.trigger('openAddFundsModal');
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
		} else if (_.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
			return '/transactions';
		}

		return this._super();
	}.property('type', 'controllers.marketplace.uri')
});

Balanced.ActivityTransactionsController = Balanced.ActivityController.extend({
	needs: ['marketplace', 'activity'],
	type: 'transaction',
	noDownloadsUri: true,
	results_base_uri: '/transactions'
});

Balanced.ActivityOrdersController = Balanced.ActivityController.extend({
	needs: ['marketplace', 'activity'],
	type: 'order'
});
