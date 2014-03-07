Balanced.CardsController = Balanced.ObjectController.extend(
	Ember.Evented,
	Balanced.ResultsTable,
	Balanced.TransactionsTable, {
		needs: ['marketplace'],

		sortField: 'created_at',
		sortOrder: 'desc',

		baseClassSelector: "#card",

		actions: {
			openDebitFundingInstrumentModal: function() {
				this.trigger('openDebitFundingInstrumentModal');
			}
		},

		extra_filtering_params: function() {
			var params = this._super();

			return _.extend({
				'status[in]': 'failed,succeeded,pending'
			}, params || {});
		}.property('transactionType', 'isDisputeType'),

		results_base_uri: function() {
			return this.get('content.transactions_uri');
		}.property('content.transactions_uri')
	}
);
