Balanced.DebitsRoute = Balanced.IframeRoute.extend({
    param: 'debit_id',
    title: 'Debits',
    resource: 'debits'
});

Balanced.DebitsDebitRoute = Balanced.ShowResource.extend({
    param: 'debit_id',
    title: 'Debits',
    resource: 'debits',
    pageTitle: 'Debits'
});

Balanced.RefundsRoute = Balanced.IframeRoute.extend({
    param: 'refund_id',
    title: 'Refunds',
    resource: 'refunds'
});

Balanced.RefundsRefundRoute = Balanced.ShowResource.extend({
    param: 'refund_id',
    title: 'Refunds',
    resource: 'refunds',
    pageTitle: 'Refunds'
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
    pageTitle: 'Credits',
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
    pageTitle: 'Holds',
    setupController: function (controller, model) {
        this._super(controller, model);
        try {
            this.controllerFor('account').set('content', model);
        } catch (e) {
            //  if not nested under account, this will not work
        }
    }
});
