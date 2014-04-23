Balanced.InvoicesRoute = Balanced.ControllerRoute.extend({
	pageTitle: 'Fees'
});

Balanced.InvoiceRoute = Balanced.ModelControllerRoute.extend({
	title: 'Invoice',
	modelObject: Balanced.Invoice,
	marketplaceUri: 'invoices_uri'
});
