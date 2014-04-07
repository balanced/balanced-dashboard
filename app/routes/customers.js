Balanced.CustomersRoute = Balanced.AuthRoute.extend({
	pageTitle: function(route, setTitle) {
		var customer = route.controller.content;
		return Balanced.Utils.maybeDeferredLoading(customer, setTitle, function() {
			return 'Customer: loading ...';
		}, function() {
			return 'Customer: %@'.fmt(customer.get('displayName'));
		});
	},

	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var customerUri = Balanced.Utils.combineUri(marketplace.get('customers_uri'), params.customer_id);
			return Balanced.Customer.find(customerUri);
		});
	},

	setupController: function(controller, model) {
		this._super(controller, model);
		controller.send('reload');
	}
});
