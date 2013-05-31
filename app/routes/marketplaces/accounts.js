var model = function () {
    return ENV.BALANCED.WWW + document.location.hash.substr(1) + '?embedded=1';
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
