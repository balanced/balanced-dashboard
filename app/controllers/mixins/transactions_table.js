// Requires the results_table mixin also, but there's no inheritance allowed for mixins
Balanced.TransactionsTable = Ember.Mixin.create({
	transactionType: 'all',

	actions: {
		changeTransactionTypeFilter: function(type, transactionType) {
			this.setProperties({
				type: type,
				transactionType: transactionType
			});
		}
	},

	isDisputeType: Ember.computed.equal('type', 'dispute'),

	extra_filtering_params: function() {
		// TODO add something for disputes here
		var transactionType = this.get('transactionType');
		var filters = {
			'status[in]': 'failed,succeeded,pending'
		};

		if (transactionType === 'all') {
			return filters;
		} else if (this.get('isDisputeType')) {
			return {
				status: transactionType
			};
		}

		return _.extend(filters, {
			state: transactionType
		});
	}.property('transactionType', 'isDisputeType'),

	results_base_uri: function() {
		if (this.get('isDisputeType')) {
			return '/disputes';
		}

		return this._super();
	}.property('type', 'controllers.marketplace.uri')
});
