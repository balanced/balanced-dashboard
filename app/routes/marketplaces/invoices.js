Balanced.InvoicesIndexRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Invoices',

	setupController: function(controller, model) {
		controller.send('reload');
	}
});

Balanced.InvoicesInvoiceRoute = Balanced.AuthRoute.extend({
	title: 'Invoice',

	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var invoiceUri = Balanced.Utils.combineUri(marketplace.get('invoices_uri'), params.invoice_id);
			return Balanced.Invoice.find(invoiceUri);
		});
	},

	setupController: function(controller, model) {
		this._super(controller, model);
		controller.send('reload');
	}
});
