Balanced.MarketplaceCustomersRoute = Balanced.ControllerRoute.extend({
	pageTitle: 'Customers'
});

Balanced.CustomerRoute = Balanced.ModelRoute.extend({
	title: 'Customer',
	modelObject: Balanced.Customer,
	marketplaceUri: 'customers_uri',
	setupController: function(controller, model) {
		this._super(controller, model);

		var disputes = Balanced.DisputesResultsLoader.create({
			path: model.get("disputes_uri")
		});

		var transactions = Balanced.TransactionsResultsLoader.create({
			path: model.get("transactions_uri")
		});

		var fundingInstruments = Balanced.CustomerFundingInstrumentsResultsLoader.create({
			customer: model
		});

		controller.setProperties({
			fundingInstrumentsResultsLoader: fundingInstruments,
			disputesResultsLoader: disputes,
			transactionsResultsLoader: transactions
		});
	}
});
