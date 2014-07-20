Balanced.MarketplaceCustomersRoute = Balanced.ControllerRoute.extend({
	pageTitle: 'Customers',
});

Balanced.CustomerRoute = Balanced.ModelRoute.extend({
	title: 'Customer',
	modelObject: Balanced.Customer,
	marketplaceUri: 'customers_uri',
	setupController: function(controller, customer) {
		this._super(controller, customer);

		controller.setProperties({
			fundingInstrumentsResultsLoader: customer.getFundingInstrumentsLoader({}),
			disputesResultsLoader: customer.getDisputesLoader({
				limit: 10
			}),
			transactionsResultsLoader: customer.getTransactionsLoader({
				limit: 10
			})
		});
	}
});
