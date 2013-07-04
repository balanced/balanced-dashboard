Balanced.ResultsSortableColumnHeaderView = Balanced.View.extend({
    tagName: 'th',

    click: function (e) {
        this.get('parentView').onSortChange(e, this.field);
    }
});

Balanced.ResultsTableView = Balanced.View.extend({
    tagName: 'table',
    classNames: 'items',
    sorts: ['unsorted', 'ascending', 'descending'],

    reset: function() {
        this.resetSortOrder();
    },

    resetSortOrder: function () {
        var allSorts = this.$('.sortable');
        allSorts.removeClass(this.sorts.join(' '));
        allSorts.data('direction', null);
    },

    onSortChange: function (e, field) {
        var $t = $(e.currentTarget);
        var sequences = {};
        for (var i = 0; i < this.sorts.length; i++) {
            sequences[this.sorts[i]] = this.sorts[(i + 1) % this.sorts.length];
        }
        var currentSort = $t.data('direction') || 'unsorted';
        var nextSort = sequences[currentSort];
        this.resetSortOrder();
        $t.data('direction', nextSort).addClass(nextSort);

        var mappedSortOrder = 'none';
        switch (nextSort) {
            case 'ascending':
                mappedSortOrder = 'asc';
                break;
            case 'descending':
                mappedSortOrder = 'desc';
                break;
        }

        this.get('controller').send('changeSortOrder', field, mappedSortOrder);
    },

    selectResult: function(uri) {
        // TODO - this sucks, should be driven from the controller
        if(this.get('parentView').reset) {
            this.get('parentView').reset();
        }

        this.get('controller').send('selectResult', uri);
    }
});

Balanced.TransactionsResultsView = Balanced.ResultsTableView.extend({
    classNames: 'transactions',
    templateName: 'results/transactions_table'
});

Balanced.CustomersResultsView = Balanced.ResultsTableView.extend({
    classNames: 'accounts',
    templateName: 'results/customers_table'
});

Balanced.FundingInstrumentsResultsView = Balanced.ResultsTableView.extend({
    classNames: 'funding-instruments',
    templateName: 'results/funding_instruments_table'
});
