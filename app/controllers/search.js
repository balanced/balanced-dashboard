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

    selectResult: function (uri) {
        this.closeSearch();
        window.location.hash = '#' + Balanced.Utils.uriToDashboardFragment(uri);
    },

    redirectToLog: function (ohm) {
        this.closeSearch();
        window.location = '#/marketplaces/{0}/logs/{1}'.format(
            this.get('controllers').get('marketplace').get('id'),
            ohm
        );
    }
});
