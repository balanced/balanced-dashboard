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

		results_base_uri: function() {
			return this.get('content.transactions_uri');
		}.property('content.transactions_uri')
	}
);
