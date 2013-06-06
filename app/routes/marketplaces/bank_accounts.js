Balanced.BankAccountsIndexRoute = Balanced.ShowResource.extend({
    param: 'bank_account_id',
    title: 'Activity',
    resource: 'bank_accounts',
    renderTemplate: function () {
        this.render('marketplace/activity');
    }
});

Balanced.BankAccountsBankAccountRoute = Balanced.ShowResource.extend({
    param: 'bank_account_id',
    title: 'Bank Account',
    resource: 'bank_accounts'
});
