
Balanced.BankAccountsRoute = Balanced.IframeRoute.extend({
    param: 'bank_account_id',
    title: 'Bank Accounts',
    resource: 'bank_accounts'
});

Balanced.BankAccountsBankAccountRoute = Balanced.ShowResource.extend({
    param: 'bank_account_id',
    title: 'Bank Account',
    resource: 'bank_accounts'
});
