Balanced.CustomersRoute = Balanced.ControllerRoute.extend({
	pageTitle: 'Customers'
});

Balanced.CustomerRoute = Balanced.ModelRoute.extend({
	title: 'Customer',
	modelObject: Balanced.Customer,
	marketplaceUri: 'customers_uri'
});
