Balanced.AccountsIndexRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Accounts',

	redirect: function() {
		this.transitionTo('activity.customers', this.modelFor('marketplace'));
	}
});

Balanced.AccountRoute = Balanced.AuthRoute.extend({
	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		var customerUri = Balanced.Utils.combineUri(marketplace.get('customers_uri'), params.account_id);
		return Balanced.Customer.find(customerUri);
	},

	redirect: function(params) {
		this.transitionTo('customer', this.modelFor('account'));
	}
});
