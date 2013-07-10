Balanced.CustomersController = Balanced.ObjectController.extend({
});

Balanced.CustomerController = Balanced.ObjectController.extend(Balanced.DownloadControllerMixin, {
	needs: ['marketplace'],

    type: 'transaction',

	minDate: null,
    maxDate: null,
    dateFilterTitle: 'Any time',

    sortField: null,
    sortOrder: null,

    baseClassSelector: "#customer",

	transactions: function() {
        return Balanced.ModelArray.newArrayLoadedFromUri(this.get('transactions_uri'), 'Balanced.Transaction');
    }.property('transactions_uri'),

    changeDateFilter: function (minDate, maxDate, title) {
        this.setProperties({
            minDate: minDate,
            maxDate: maxDate,
            dateFilterTitle: title
        });
    },

    changeSortOrder: function (field, sortOrder) {
        this.setProperties({
            sortField: field,
            sortOrder: sortOrder
        });
    },

    changeTypeFilter: function (type) {
        this.set('type', type);
    },

    getSearchUri: function () {
        return this.get('transactions_uri');
    },

    loadMore: function (results) {
        results.loadNextPage();
    },

    transactions_uri: function() {
        var searchParams = {
            type: this.get('type'),
            minDate: this.get('minDate'),
            maxDate: this.get('maxDate'),
            sortField: this.get('sortField'),
            sortOrder: this.get('sortOrder')
        };

        return Balanced.Utils.applyUriFilters(this.get('content.transactions_uri'), searchParams);
    }.property('type', 'minDate', 'maxDate', 'sortField', 'sortOrder'),
});
