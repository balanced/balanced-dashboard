Balanced.MarketplaceFundingInstrumentsRoute = Balanced.AuthRoute.extend({
    model: function () {
        var marketplace = this.modelFor('marketplace');
        marketplace.reload();
        return marketplace;
    },
    events: {
        fundingInstrumentSelected: function (fundingInstrument) {
            window.location.hash = '#' + Balanced.Utils.uriToDashboardFragment(fundingInstrument.uri);
        }
    }
});
