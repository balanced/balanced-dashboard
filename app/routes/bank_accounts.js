Balanced.BankAccountsIndexRoute = Balanced.AuthRoute.extend({
    redirect: function () {
        this.transitionTo('activity.funding_instruments', this.modelFor('marketplace'));
    }
});

Balanced.BankAccountsRoute = Balanced.AuthRoute.extend({
    pageTitle: function (route, setTitle) {
        var bankAccount = route.controller.content;
        return Balanced.Utils.maybeDeferredLoading(bankAccount, setTitle, function () {
            return 'Bank Account: loading ...';
        }, function () {
            return 'Bank Account: {0}'.format(bankAccount.get('description'));
        });
    },

    model: function (params) {
        var marketplace = this.modelFor('marketplace');
        return marketplace.then(function (marketplace) {
            var bankAccountUri = marketplace.get('bank_accounts_uri') + '/' + params.bank_account_id;
            return Balanced.BankAccount.find(bankAccountUri);
        });
    }
});
