Balanced.MarketplaceAddCustomerRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Add Customer',

	setupController: function(controller, model) {
		var marketplace = this.modelFor('marketplace');

		controller.set('content', Balanced.Customer.create({
			uri: marketplace.get('customers_uri'),
			address: {}
		}));

		controller.set('optionalFieldsOpen', false);
	}
});
