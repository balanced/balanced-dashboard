Balanced.DebitsRoute = Balanced.IframeRoute.extend({
    param: 'debit_id',
    title: 'Debits',
    resource: 'debits'
});

Balanced.DebitsDebitRoute = Balanced.ShowResource.extend({
    param: 'debit_id',
    title: 'Debits',
    resource: 'debits'
});

Balanced.RefundsRoute = Balanced.IframeRoute.extend({
    param: 'refund_id',
    title: 'Refunds',
    resource: 'refunds'
});

Balanced.RefundsRefundRoute = Balanced.ShowResource.extend({
    param: 'refund_id',
    title: 'Refunds',
    resource: 'refunds'
});

Balanced.CreditsRoute = Balanced.IframeRoute.extend({
    param: 'credit_id',
    title: 'Credits',
    resource: 'credits'
});

Balanced.CreditsCreditRoute = Balanced.ShowResource.extend({
    param: 'credit_id',
    title: 'Credits',
    resource: 'credits',
    setupController: function (controller, model) {
        this._super(controller, model);
        try {
            this.controllerFor('account').set('content', model);
        } catch (e) {
            //  if not nested under account, this will not work
        }
    }
});

Balanced.HoldsRoute = Balanced.IframeRoute.extend({
    param: 'hold_id',
    title: 'Holds',
    resource: 'holds'
});

Balanced.HoldsHoldRoute = Balanced.ShowResource.extend({
    param: 'hold_id',
    title: 'Holds',
    resource: 'holds',
    setupController: function (controller, model) {
        this._super(controller, model);
        try {
            this.controllerFor('account').set('content', model);
        } catch (e) {
            //  if not nested under account, this will not work
        }
    }
});

Balanced.MarketplaceTransactionsRoute = Balanced.AuthRoute.extend({
    model: function () {
        var marketplace = this.modelFor('marketplace');
        var transactions = marketplace.get('transactions');
        // HACK: never hard-code the cookie key directly, only doing this to
        // limit scope of migration changes
        var showWelcome = $.cookie('existing') && !$.cookie('suppressWelcome');
        marketplace.refresh();
        transactions.refresh();
        //  TODO: this is migration code, remove it after August 2013
        setTimeout(function () {
            $('#welcome-transition').modal('show');
        }, 100);
        return {
            marketplace: marketplace,
            showWelcome: showWelcome,
            transactions: transactions
        };
    },
    events: {
        hideWelcome: function () {
            $.cookie('suppressWelcome', 1);
            $.removeCookie('existing');
            $('#welcome-transition').modal('hide');
        },
        transactionSelected: function (transaction) {
            window.location.hash = '#' + Balanced.Utils.uriToDashboardFragment(transaction.uri);
        }
    }
});
