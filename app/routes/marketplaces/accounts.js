var model = function () {
    var uri = ENV.BALANCED.WWW + document.location.hash.substr(1) + '?embedded=1';
    return uri;
};

Balanced.AccountsIndexRoute = Balanced.AuthRoute.extend({
    model: model
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
        return marketplace.get('web_uri') + '/accounts/new?embedded=1';
    }
});

Balanced.AccountRoute = Balanced.AuthRoute.extend({
    model: model,
    renderTemplate: function () {
        this.render('accounts/account');
    }
});
