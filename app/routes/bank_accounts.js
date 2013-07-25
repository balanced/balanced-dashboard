Balanced.BankAccountsIndexRoute = Balanced.AuthRoute.extend({
    redirect: function () {
        this.transitionTo('activity.funding_instruments');
    }
});

Balanced.BankAccountRoute = Balanced.AuthRoute.extend({
    page_title: function (route, set_title) {
        var account = route.controller.content;
        return Balanced.Utils.loadSetTitle(account, set_title, function () {
            return 'Bank Account: loading ...'; 
        }, function () {
            return 'Bank Account: {0} ({1} {2})'.format(
                account.get('name'), 
                account.get('last_four'), 
                Balanced.Utils.toTitleCase(account.get('bank_name'))
            );
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
