Balanced.BankAccountsIndexRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		this.transitionTo('activity.funding_instruments', this.modelFor('marketplace'));
	}
});

Balanced.BankAccountsRoute = Balanced.ModelControllerRoute.extend({
	title: 'Bank Account',
	modelObject: Balanced.BankAccount,
	marketplaceUri: 'bank_accounts_uri'
});
