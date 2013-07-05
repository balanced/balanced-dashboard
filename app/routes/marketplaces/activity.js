Balanced.ActivityRoute = Balanced.AuthRoute.extend({
});

Balanced.ActivityIndexRoute = Balanced.AuthRoute.extend({
    redirect: function () {
        this.transitionTo('activity.transactions');
    }
});

Balanced.ActivityTransactionsRoute = Balanced.AuthRoute.extend({
});

Balanced.ActivityCustomersRoute = Balanced.AuthRoute.extend({
});

Balanced.ActivityFundingInstrumentsRoute = Balanced.AuthRoute.extend({
});
