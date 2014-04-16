require('app/routes/marketplaces/customers');

Balanced.AccountsRoute = Balanced.CustomerRoute.extend({
	redirect: function() {
		this.transitionTo('customers', this.modelFor('accounts'));
	}
});
