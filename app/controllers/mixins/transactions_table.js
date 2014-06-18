// Requires the results_table mixin also, but there's no inheritance allowed for mixins
Balanced.TransactionsTable = Ember.Mixin.create({
	transactionStatus: 'all',
	transactionTypeFilter: false,

	actions: {
		changeTransactionStatusFilter: function(status) {
			this.setProperties({
				transactionStatus: status
			});
		},
	},

	extra_filtering_params: function() {
		var transactionStatus = this.get('transactionStatus');
		var type = this.get('type');

		if (type !== 'transaction' && !_.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
			return {};
		}

		if (!transactionStatus || transactionStatus === 'all') {
			return {
				'status[in]': 'failed,succeeded,pending'
			};
		}

		return {
			status: transactionStatus
		};
	}.property('type', 'transactionStatus')
});
