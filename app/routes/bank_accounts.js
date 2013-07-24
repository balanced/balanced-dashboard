Balanced.BankAccountsIndexRoute = Balanced.AuthRoute.extend({
    redirect: function () {
        this.transitionTo('activity.funding_instruments');
    }
});

Balanced.BankAccountRoute = Balanced.AuthRoute.extend({
    title: 'Bank Account',

    model: function (params) {
        var marketplace = this.modelFor('marketplace');
        return marketplace.then(function (marketplace) {
            var bankAccountUri = marketplace.get('bank_accounts_uri') + '/' + params.bank_account_id;
            return Balanced.BankAccount.find(bankAccountUri);
        });
    }
});
