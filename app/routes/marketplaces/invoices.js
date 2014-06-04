Balanced.InvoicesRoute = Balanced.ControllerRoute.extend({
	pageTitle: 'Account statements'
});

Balanced.InvoiceRoute = Balanced.ModelControllerRoute.extend({
	title: 'Invoice',
	modelObject: Balanced.Invoice,
	marketplaceUri: 'invoices_uri'
});

// Balanced.RedirectInvoicesRoute = Balanced.RedirectRoute("invoices.index");
