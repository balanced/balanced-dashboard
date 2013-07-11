Balanced.CustomersController = Balanced.ObjectController.extend({
});

Balanced.CustomerController = Balanced.ObjectController.extend(Balanced.DownloadControllerMixin, Balanced.ResultsTable, {
	needs: ['marketplace'],

	sortField: 'created_at',
    sortOrder: 'desc',

    baseClassSelector: "#customer",

    results_base_uri: function() {
        return this.get('content.transactions_uri');
    }.property('content.transactions_uri')
});
