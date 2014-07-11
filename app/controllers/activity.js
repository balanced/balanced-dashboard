Balanced.ActivityController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
	needs: ['marketplace'],

	sortField: 'created_at',
	sortOrder: 'desc',
	limit: 50,

	baseClassSelector: '#activity',
	noDownloadsUri: true,

	transactionStatus: 'all',

	actions: {
		openPaySellerModal: function() {
			this.trigger('openPaySellerModal');
		},

		openChargeCardModal: function() {
			this.trigger('openChargeCardModal');
		},

		changeTypeFilter: function(type) {
			// this._super(type);
			this.set('type', type);


			if (type === 'transaction' || _.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
				this.transitionToRoute('activity.transactions');
			} else if (type === 'order') {
				this.transitionToRoute('activity.orders');
			}
		},

		changeStatusFilter: function(status) {
			this.set('transactionStatus', status);
		},

		openAddFundsModal: function() {
			this.trigger('openAddFundsModal');
		},

		openWithdrawFundsModal: function() {
			this.trigger('openWithdrawFundsModal');
		}
	},

	extra_filtering_params: function() {
		return {};
	}.property(),

	results_base_uri: function() {
		var type = this.get('type');

		if (type === 'dispute') {
			return '/disputes';
		} else if (type === 'transaction' || _.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
			return '/transactions';
		} else {
			return this._super();
		}
	}.property('type', 'controllers.marketplace.uri')
});

Balanced.ActivityTransactionsController = Balanced.ActivityController.extend({
	needs: ['marketplace'],
	baseClassSelector: '#transactions',
	type: 'transaction',
	pageTitle: 'Transactions',
	noDownloadsUri: true,
	category: "transaction",
	results_base_uri: "/transactions",

	extra_filtering_params: function() {
		var transactionStatus = this.get("transactionStatus");

		if (transactionStatus === 'all') {
			return {
				'status[in]': 'failed,succeeded,pending'
			};
		}
		return {
			status: transactionStatus
		};
	}.property("transactionStatus")
});

Balanced.ActivityOrdersController = Balanced.ActivityController.extend({
	needs: ['marketplace'],
	baseClassSelector: '#orders',
	type: 'order',
	pageTitle: 'Orders'
});
