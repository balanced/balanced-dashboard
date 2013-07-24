Balanced.InvoicesIndexRoute = Balanced.Route.extend({
    title: 'Invoices',
});

Balanced.InvoicesRoute = Balanced.IframeRoute.extend({
    param: 'invoice_id',
    title: 'Invoices',
    resource: 'invoices'
});

Balanced.InvoicesInvoiceRoute = Balanced.ShowResource.extend({
    param: 'invoice_id',
    title: 'Invoice',
    resource: 'invoices'
});
