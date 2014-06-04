Balanced.ActivityController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, Balanced.TransactionsTable, {
	needs: ['marketplace'],

	sortField: 'created_at',
	sortOrder: 'desc',
	limit: 50,

	baseClassSelector: '#activity',
	noDownloadsUri: true,

	transactionStatus: 'all',
	TYPE_TRANSLATION: {
		card_hold: 'hold'
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
		},

		openAddFundsModal: function() {
			this.trigger('openAddFundsModal');
		},

		openWithdrawFundsModal: function() {
			this.trigger('openWithdrawFundsModal');
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
});

Balanced.ActivityTransactionsController = Balanced.ActivityController.extend({
	needs: ['marketplace'],
	baseClassSelector: '#transactions',
	type: 'transaction',
	pageTitle: 'Transactions',
	noDownloadsUri: true,

	results_base_uri: function() {
		var type = this.get('type');

		return type === 'dispute' ?
			'/disputes' :
			'/transactions';
	}.property('type')
});

Balanced.ActivityOrdersController = Balanced.ActivityController.extend({
	needs: ['marketplace'],
	baseClassSelector: '#orders',
	type: 'order',
	pageTitle: 'Orders'
});
