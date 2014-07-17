Balanced.MarketplaceCustomersController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
	needs: ['marketplace'],
	limit: 50,
	sortField: 'created_at',
	sortOrder: 'desc',
	baseClassSelector: "#customer",
	noDownloadsUri: true,

	results_base_uri: Ember.computed.readOnly('controllers.marketplace.customers_uri')
});

