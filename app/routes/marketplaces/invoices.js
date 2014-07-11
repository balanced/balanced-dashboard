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
			path: model.get("disputes_uri")
		});
		controller.set("disputesResultsLoader", disputesResultsLoader);
	}
});

Balanced.MarketplaceRedirectInvoicesRoute = Balanced.RedirectRoute("marketplace.invoices");
