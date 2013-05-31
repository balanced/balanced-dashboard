
Balanced.ShowResource = Balanced.IframeRoute.extend({
    setupController: function (controller, model) {
        this.controllerFor(this.resource).set('content', model);
    }
});

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
    resource: 'credits'
});

Balanced.HoldsRoute = Balanced.IframeRoute.extend({
    param: 'hold_id',
    title: 'Holds',
    resource: 'holds'
});

Balanced.HoldsHoldRoute = Balanced.ShowResource.extend({
    param: 'hold_id',
    title: 'Holds',
    resource: 'holds'
});

Balanced.MarketplaceTransactionsRoute = Balanced.AuthRoute.extend({
    model: function (params) {
        return this.modelFor('marketplace');
    }
});
