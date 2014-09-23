import ModelRoute from "./model";
import Invoice from "../models/invoice";

var InvoiceRoute = ModelRoute.extend({
	title: 'Account statement',
	modelObject: Invoice,
	marketplaceUri: 'invoices_uri',
	setupController: function(controller, model) {
		this._super(controller, model);
		controller.setProperties({
			disputesResultsLoader: model.getInvoicesLoader(),
			transactionsResultsLoader: model.getTransactionsLoader()
		});
	}
});

export default InvoiceRoute;
