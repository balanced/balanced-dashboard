require('app/routes/marketplaces/customers');

Balanced.AccountsIndexRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Accounts',

	redirect: function() {
		this.transitionTo('activity.customers', this.modelFor('marketplace'));
	}
});

Balanced.AccountRoute = Balanced.CustomerRoute.extend({
	redirect: function(params) {
		this.transitionTo('customer', this.modelFor('account'));
	}
});
