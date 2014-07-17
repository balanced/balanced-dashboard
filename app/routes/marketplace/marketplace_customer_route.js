Balanced.MarketplaceCustomersRoute = Balanced.ControllerRoute.extend({
	pageTitle: 'Customers'
});

Balanced.CustomerRoute = Balanced.ModelRoute.extend({
	title: 'Customer',
	modelObject: Balanced.Customer,
	marketplaceUri: 'customers_uri',
	setupController: function(controller, model) {
		this._super(controller, model);

		var disputesResultsLoader = Balanced.DisputesResultsLoader.create({
			path: model.get("disputes_uri")
		});

		controller.setProperties({
			disputesResultsLoader: disputesResultsLoader,
		});
	}
});
