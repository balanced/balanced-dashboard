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

	isDisputeType: function() {
		return this.get('type') === 'dispute';
	}.property('type'),

	extra_filtering_params: function() {
		// TODO add something for disputes here
		var transactionType = this.get('transactionType');

		if (transactionType === 'all') {
			return {};
		} else if (this.get('isDisputeType')) {
			return {
				status: transactionType
			};
		}

		return {
			state: transactionType
		};
	}.property('transactionType', 'isDisputeType')
});
