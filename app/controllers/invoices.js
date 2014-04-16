Balanced.MarketplaceInvoicesController = Balanced.ObjectController.extend(
	Ember.Evented,
	Balanced.ResultsTable, {
		needs: ['marketplace'],

		sortField: 'created_at',
		sortOrder: 'desc',
		results_type: 'Balanced.Invoice',
		type: null,
		limit: 20,

		baseClassSelector: '#invoices',
		results_base_uri: Ember.computed.readOnly('controllers.marketplace.invoices_uri')
	}
);
