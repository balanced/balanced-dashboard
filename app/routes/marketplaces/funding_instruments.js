Balanced.MarketplaceFundingInstrumentsRoute = Balanced.AuthRoute.extend({
    model: function () {
        var marketplace = this.modelFor('marketplace');
        return marketplace;
    }
});
