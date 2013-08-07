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
    redirect: function() {
        var marketplace = this.modelFor('marketplace');
        var customerId = window.location.hash.substr(window.location.hash.lastIndexOf('/'));
        var customerUri = marketplace.get('customers_uri') + customerId;
        this.transitionTo('customer', Balanced.Customer.find(customerUri));
    },

    model: function() {
        return null;
    }
});
