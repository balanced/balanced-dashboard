Balanced.MarketplaceActivityRoute = Balanced.AuthRoute.extend({
    redirect: function() {
        this.transitionTo('marketplace.transactions');
    }
});
