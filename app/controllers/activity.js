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
			this.set('type', type);

			if (type === 'transaction' || _.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
				this.transitionToRoute('marketplace.transactions');
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

Balanced.ActivityOrdersController = Balanced.ActivityController.extend({
	needs: ['marketplace'],
	baseClassSelector: '#orders',
	type: 'order',
	pageTitle: 'Orders'
});
