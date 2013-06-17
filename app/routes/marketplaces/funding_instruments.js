Balanced.MarketplaceFundingInstrumentsRoute = Balanced.AuthRoute.extend({
    model: function () {
        return this.modelFor('marketplace');
    },
    events: {
        fundingInstrumentSelected: function (fundingInstrument) {
            window.location.hash = '#' + Balanced.Utils.uriToDashboardFragment(fundingInstrument.uri);
        }
    }
});
