require('app/routes/marketplaces/customers');

Balanced.AccountsIndexRoute = Balanced.RedirectRoute('marketplace.customers');
Balanced.AccountRoute = Balanced.RedirectRoute('customer', 'account');
