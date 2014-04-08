Balanced.FundingInstrumentsIndexController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
	needs: ['marketplace'],

	sortField: 'created_at',
	sortOrder: 'desc',

	baseClassSelector: "#funding-instruments",
	noDownloadsUri: true,

	results_base_uri: Ember.computed.alias('controllers.marketplace.transactions_uri')
});

Balanced.FundingInstrumentsController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {});