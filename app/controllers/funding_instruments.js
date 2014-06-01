Balanced.MarketplaceFundingInstrumentsController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
	needs: ['marketplace', 'activity'],
	limit: 50,

	sortField: 'created_at',
	sortOrder: 'desc',

	baseClassSelector: "#funding-instruments",
	noDownloadsUri: true,

	type: 'funding_instrument'
});
