Balanced.CardsController = Balanced.ObjectController.extend(
	Balanced.ActionEvented('openDebitFundingInstrumentModal', 'openHoldCardModal'),
	Balanced.ResultsTable,
	Balanced.TransactionsTable, {
		needs: ['marketplace'],

		sortField: 'created_at',
		sortOrder: 'desc',

		baseClassSelector: "#card",
		results_base_uri: Ember.computed.readOnly('content.transactions_uri')
	}
);
