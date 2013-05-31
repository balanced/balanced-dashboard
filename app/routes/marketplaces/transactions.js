Balanced.IframeRoute = Balanced.AuthRoute.extend({
    param: null,
    model: function (params) {
        var marketplace = this.modelFor('marketplace');
        var uri = marketplace.get('web_uri') + '/refunds';
        if (params[this.param]) {
            uri += '/' + params[this.param];
        }
        return {
            'uri': uri + '?embedded=1',
            'title': this.title
        };
    },
    renderTemplate: function () {
        this.render('iframe');
    }
});

Balanced.RefundsRoute = Balanced.IframeRoute.extend({
    param: 'refund_id',
    title: 'Refunds'
});

Balanced.DebitsRoute = Balanced.IframeRoute.extend({
    param: 'debit_id',
    title: 'Debits'
});

Balanced.CreditsRoute = Balanced.IframeRoute.extend({
    param: 'credit_id',
    title: 'Credits'
});

Balanced.HoldsRoute = Balanced.IframeRoute.extend({
    param: 'hold_id',
    title: 'Holds'
});

Balanced.MarketplaceTransactionsRoute = Balanced.AuthRoute.extend({
    model: function (params) {
        return this.modelFor('marketplace');
    }
});
