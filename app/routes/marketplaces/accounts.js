var model = function () {
    var uri = ENV.BALANCED.WWW + document.location.hash.substr(1) + Balanced.MigrationUtils.embeddedQueryString();
    return uri;
};

Balanced.AccountsIndexRoute = Balanced.AuthRoute.extend({
    pageTitle: 'Accounts',

    redirect: function () {
        this.transitionTo('activity.customers');
    }
});

Balanced.AccountsCreditRoute = Balanced.AuthRoute.extend({
    model: model
});

Balanced.AccountsDebitRoute = Balanced.AuthRoute.extend({
    model: model
});

Balanced.AccountsRefundRoute = Balanced.AuthRoute.extend({
    model: model
});

Balanced.AccountsHoldRoute = Balanced.AuthRoute.extend({
    model: model
});

Balanced.AccountRoute = Balanced.AuthRoute.extend({
    model: function(params) {
        var marketplace = this.modelFor('marketplace');
        var customerUri = marketplace.get('customers_uri') + '/' + params.account_id;
        return Balanced.Customer.find(customerUri);
    },

    redirect: function(params) {
        this.transitionTo('customer', this.modelFor('account'));
    }
});
