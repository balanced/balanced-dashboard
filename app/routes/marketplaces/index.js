Balanced.MarketplaceIndexRoute = Balanced.AuthRoute.extend({
    redirect: function() {
        this.transitionTo('activity');
    }
});
