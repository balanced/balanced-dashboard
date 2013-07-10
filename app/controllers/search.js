Balanced.SearchController = Balanced.ObjectController.extend(Balanced.DownloadControllerMixin, Balanced.SearchResults, {
    needs: ['marketplace'],

    search: null,
    debounced_search: null,
    default_search: null,

    baseClassSelector: '#search',

    displayResults: function () {
        return !!this.get('content');
    }.property('content'),

    closeSearch: function () {
        this.reset();
    },

    redirectToLog: function (ohm) {
        this.closeSearch();
        window.location = '#/marketplaces/{0}/logs/{1}'.format(
            this.get('controllers').get('marketplace').get('id'),
            ohm
        );
    },

    // UI properties
    transactionsTabSelected: function () {
        return this.get('category') === "transaction";
    }.property('category'),

    customersTabSelected: function () {
        return this.get('category') === "account";
    }.property('category'),

    fundingInstrumentsTabSelected: function () {
        return this.get('category') === "funding_instrument";
    }.property('category'),
});
