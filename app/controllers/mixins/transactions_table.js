// Requires the results_table mixin also, but there's no inheritance allowed for mixins
Balanced.TransactionsTable = Ember.Mixin.create({
	transactionType: 'all',
	isDisputeType: Ember.computed.equal('type', 'dispute'),

	TYPE_TRANSLATION: {
		'card_hold': 'hold'
	},

	actions: {
		changeTransactionStatusFilter: function(status) {
			this.setProperties({
				transactionType: status
			});
		},
	},

	extra_filtering_params: function() {
		var transactionType = this.get('transactionType');
		var type = this.get('type');

		if (type !== 'transaction' && !_.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
			return {};
		}

		if (!transactionType || transactionType === 'all') {
			return {
				'status[in]': 'failed,succeeded,pending'
			};
		}

		return {
			status: transactionType
		};
	}.property('type', 'transactionType'),

	results_base_uri: function() {
		if (this.get('isDisputeType')) {
			return '/disputes';
		}

		return this._super();
	}.property('type', 'controllers.marketplace.uri')
});
