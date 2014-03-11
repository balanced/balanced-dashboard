// Requires the results_table mixin also, but there's no inheritance allowed for mixins
Balanced.TransactionsTable = Ember.Mixin.create({
	transactionType: 'all',
	isDisputeType: Ember.computed.equal('type', 'dispute'),

	actions: {
		changeTransactionStatusFilter: function(status) {
			this.setProperties({
				transactionType: status
			});
		},
	},

	extra_filtering_params: {
		'status[in]': 'failed,succeeded,pending'
	},

	results_base_uri: function() {
		if (this.get('isDisputeType')) {
			return '/disputes';
		}

		return this._super();
	}.property('type', 'controllers.marketplace.uri')
});
