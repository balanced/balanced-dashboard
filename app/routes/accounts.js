Balanced.AccountsRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		this.transitionTo('customers', this.modelFor('accounts'));
	},

	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var customerUri = Balanced.Utils.combineUri(marketplace.get('customers_uri'), params.account_id);
			return Balanced.Customer.find(customerUri);
		});
	}
});
