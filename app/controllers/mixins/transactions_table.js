// Requires the results_table mixin also, but there's no inheritance allowed for mixins
Balanced.TransactionsTable = Ember.Mixin.create({
	transactionType: 'all',

	actions: {
		changeTransactionTypeFilter: function (type, transactionType) {
			this.setProperties({
				type: type,
				transactionType: transactionType
			});
		}
	},

	extra_filtering_params: function () {
		var transactionType = this.get('transactionType');
		if (transactionType === 'all') {
			return {};
		}
		return {
			state: transactionType
		};
	}.property('transactionType')
});
