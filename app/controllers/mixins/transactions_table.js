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

	extra_filtering_params: function() {
		// TODO add something for disputes here
		var transactionType = this.get('transactionType');

		if (transactionType === 'all') {
			return {};
		} else if (this.get('type') === 'dispute') {
			return {
				status: transactionType
			};
		}

		return {
			state: transactionType
		};
	}.property('transactionType', 'type')
});
