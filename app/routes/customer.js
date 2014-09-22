import ModelRoute from "./model";
import Customer from "../models/customer";

var CustomerRoute = ModelRoute.extend({
	title: 'Customer',
	modelObject: Customer,
	marketplaceUri: 'customers_uri',
	setupController: function(controller, customer) {
		this._super(controller, customer);

		controller.setProperties({
			fundingInstrumentsResultsLoader: customer.getFundingInstrumentsLoader({
				limit: 10
			}),
			disputesResultsLoader: customer.getDisputesLoader({
				limit: 10
			}),
			transactionsResultsLoader: customer.getTransactionsLoader({
				limit: 10,
				status: ['pending', 'succeeded', 'failed']
			})
		});
	}
});

export default CustomerRoute;
