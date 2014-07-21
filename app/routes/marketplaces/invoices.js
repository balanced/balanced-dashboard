Balanced.InvoicesRoute = Balanced.ControllerRoute.extend({
	pageTitle: 'Account statements'
});

Balanced.InvoiceRoute = Balanced.ModelControllerRoute.extend({
	title: 'Account statement',
	modelObject: Balanced.Invoice,
	marketplaceUri: 'invoices_uri',
	setupController: function(controller, model) {
		this._super(controller, model);
		var disputesResultsLoader = Balanced.DisputesResultsLoader.create({
			path: model.get("disputes_uri"),
			// Note: The Api is throwing an error when fetching the disputes using /invoices/:invoice_id/disputes
			// so we are defaulting this to created_at for now.
			// description: "Unable to sort on unknown field "initiated_at" Your request id is OHM4eadba4c092211e4b88e02b12035401b."
			sort: "created_at,desc"
		});
		controller.set("disputesResultsLoader", disputesResultsLoader);
	}
});
