require('app/routes/customers');

Balanced.AccountsRoute = Balanced.CustomersRoute.extend({
	redirect: function() {
		this.transitionTo('customers', this.modelFor('accounts'));
	}
});
