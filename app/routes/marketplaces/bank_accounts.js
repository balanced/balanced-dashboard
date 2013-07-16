Balanced.BankAccountsIndexRoute = Balanced.AuthRoute.extend({
    redirect: function () {
        this.transitionTo('activity.funding_instruments');
    }
});

Balanced.BankAccountsBankAccountRoute = Balanced.ShowResource.extend({
    param: 'bank_account_id',
    title: 'Bank account',
    resource: 'bank_accounts',
    setupController: function (controller, model) {
        this._super(controller, model);
        try {
            this.controllerFor('account').set('content', model);
        } catch (e) {
            //  if not nested under account, this will not work
        }
    }
});

Balanced.BankAccountRoute = Balanced.ShowResource.extend({
    param: 'bank_account_id',
    title: 'Bank Account',
    resource: 'bank_accounts'
});

Balanced.BankAccountTransactionsRoute = Balanced.ShowResource.extend({
    param: 'bank_account_id',
    title: 'Bank Account Transactions',
    resource: 'bank_account',

    model: function (params) {
        var marketplace = this.modelFor('marketplace');
        var bank_account = window.location.hash.split('/')[4];
        var uri = marketplace.get('web_uri') + '/bank_accounts/' + bank_account + '/transactions';

        return {
            'uri': uri + Balanced.MigrationUtils.EMBEDDED_QUERY_APPEND,
            'title': this.title,
            'marketplace': marketplace
        };
    }
});
