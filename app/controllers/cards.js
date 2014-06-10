Balanced.CardsController = Balanced.ObjectController.extend(
	Balanced.ActionEvented('openDebitFundingInstrumentModal', 'openCreditFundingInstrumentModal', 'openHoldCardModal'),
	Balanced.ResultsTable,
	Balanced.TransactionsTable, {
		needs: ['marketplace'],

		sortField: 'created_at',
		sortOrder: 'desc',

		baseClassSelector: "#card",

		results_base_uri: function() {
			return this.get('type') === 'dispute' ?
				'/disputes' :
				this.get("content.transactions_uri");
		}.property("type", "content.transactions_uri")
	}
);
