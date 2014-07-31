Balanced.InvoiceRoute = Balanced.ModelRoute.extend({
	title: 'Account statement',
	modelObject: Balanced.Invoice,
	marketplaceUri: 'invoices_uri',
	setupController: function(controller, model) {
		this._super(controller, model);
		controller.setProperties({
			disputesResultsLoader: model.getInvoicesLoader(),
			transactionsResultsLoader: model.getTransactionsLoader()
		});
	}
});
