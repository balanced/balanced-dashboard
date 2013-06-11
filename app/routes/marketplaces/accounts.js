var model = function () {
    var uri = ENV.BALANCED.WWW + document.location.hash.substr(1) + Balanced.MigrationUtils.embeddedQueryString();
    return uri;
};

Balanced.AccountsIndexRoute = Balanced.ShowResource.extend({
    param: 'account_id',
    title: 'Activity',
    resource: 'accounts',
    renderTemplate: function () {
        this.render('marketplace/activity');
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

Balanced.AccountsNewRoute = Balanced.AuthRoute.extend({
    model: function () {
        var marketplace = this.modelFor('marketplace');
        return marketplace.get('web_uri') + '/accounts/new' + Balanced.MigrationUtils.embeddedQueryString();
    }
});

Balanced.AccountRoute = Balanced.AuthRoute.extend({
    model: model,
    renderTemplate: function () {
        this.render('accounts/account');
    }
});
