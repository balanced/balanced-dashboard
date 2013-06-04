Balanced.InvoicesInvoiceRoute = Balanced.AuthRoute.extend({
    model: function (params) {
        var marketplace = this.modelFor('marketplace');
        return marketplace.get('web_uri') + '/invoices/' + params.invoice_id + Balanced.MigrationUtils.EMBEDDED_QUERY_APPEND;
    }
});
