Balanced.InvoicesIndexController = Balanced.ObjectController.extend(
	Ember.Evented,
	Balanced.ResultsTable, {
		needs: ['marketplace'],

		sortField: 'created_at',
		sortOrder: 'desc',
		results_type: 'Balanced.Invoice',
		type: null,
		limit: 20,

		baseClassSelector: '#invoices',

		results_base_uri: function() {
			return this.get('controllers.marketplace.invoices_uri');
		}.property('controllers.marketplace.invoices_uri'),
	}
);
