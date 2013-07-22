Balanced.CustomersRoute = Balanced.AuthRoute.extend({
});

Balanced.CustomerRoute = Balanced.AuthRoute.extend({
	model: function (params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var customerUri = marketplace.get('customers_uri') + '/' + params.customer_id;
			return Balanced.Customer.find(customerUri);
		});
	}
});
