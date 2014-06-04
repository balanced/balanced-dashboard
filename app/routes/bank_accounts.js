Balanced.BankAccountsIndexRoute = Balanced.RedirectRoute('activity.funding_instruments');

Balanced.BankAccountsRoute = Balanced.ModelControllerRoute.extend({
	title: 'Bank Account',
	modelObject: Balanced.BankAccount,
	marketplaceUri: 'bank_accounts_uri'
});
