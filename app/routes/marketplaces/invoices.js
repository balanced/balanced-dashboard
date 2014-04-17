Balanced.InvoicesRoute = Balanced.ControllerRoute.extend({
	pageTitle: 'Invoices'
});

Balanced.InvoiceRoute = Balanced.ModelControllerRoute.extend({
	title: 'Invoice',
	modelObject: Balanced.Invoice,
	marketplaceUri: 'invoices_uri'
});
