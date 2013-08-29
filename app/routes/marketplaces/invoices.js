Balanced.InvoicesIndexRoute = Balanced.AuthRoute.extend({
    pageTitle: 'Invoices'
});

Balanced.InvoicesInvoiceRoute = Balanced.ShowResource.extend({
    param: 'invoice_id',
    title: 'Invoice',
    resource: 'invoices'
});
