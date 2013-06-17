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
    setupController: function(controller, model) {
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
    setupController: function(controller, model) {
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
        return this.modelFor('marketplace');
    },
    setupController: function (controller, model) {
        this._super(controller, model);
        Balanced.COOKIE.set(Balanced.COOKIE.MARKETPLACE_URI, model.get('uri'), {
            expires: Balanced.TIME.THREE_YEARS
        });
    },

    events: {
        transactionSelected: function(transaction) {
            window.location.hash = '#' + Balanced.Utils.uriToDashboardFragment(transaction.uri);
        }
    }
});
