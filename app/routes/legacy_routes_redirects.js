Balanced.AccountsIndexRoute = Balanced.RedirectRoute('marketplace.customers');
Balanced.AccountRoute = Balanced.RedirectRoute('customer', 'account');

Balanced.MarketplaceRedirectActivityTransactionsRoute = Balanced.RedirectRoute("marketplace.transactions");
Balanced.MarketplaceRedirectActivityOrdersRoute = Balanced.RedirectRoute("activity.orders");
Balanced.MarketplaceRedirectActivityCustomersRoute = Balanced.RedirectRoute('marketplace.customers');
Balanced.MarketplaceRedirectActivityFundingInstrumentsRoute = Balanced.RedirectRoute('marketplace.funding_instruments');
Balanced.MarketplaceRedirectActivityDisputesRoute = Balanced.RedirectRoute('marketplace.disputes');
Balanced.MarketplaceRedirectInvoicesRoute = Balanced.RedirectRoute("marketplace.invoices");
