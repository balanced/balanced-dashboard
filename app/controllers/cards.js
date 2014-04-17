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
			},
			openHoldCardModal: function() {
				this.trigger('openHoldCardModal');
			}
		},

		results_base_uri: Ember.computed.readOnly('content.transactions_uri')
	}
);
