Balanced.InvoicesIndexRoute = Balanced.ControllerRoute.extend({
	pageTitle: 'Invoices'
});

Balanced.InvoicesInvoiceRoute = Balanced.ModelControllerRoute.extend({
	title: 'Invoice',
	modelObject: Balanced.Invoice,
	marketplaceUri: 'invoices_uri'
});
