Balanced.ResultsFiltersHeaderView = Balanced.View.extend({
    templateName: 'results/results_filters_header',
    tagName: 'header',

    reset: function() {
        this.resetSelectedTab();
        this.resetDateTimePicker();
    },

    resetSelectedTab: function() {
        this.$('nav > li').removeClass('selected');
        this.$('nav > li.transactions').addClass('selected');
    },

    resetDateTimePicker: function () {
        this.$('.set-times li').removeClass('selected');
        this.$('.dp').val('');
        this.$('.timing > .dropdown-toggle > span').text('Any time');

        this.get('dateTimePicker').resetDateTimePicker();
    },
});

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
    classNameBindings: 'selected',
    templateName: 'results/transactions_table',

    selected: function() {
        return this.get('controller.category') === "transaction" ? "selected" : "";
    }.property('controller.category')
});

Balanced.CustomersResultsView = Balanced.ResultsTableView.extend({
    classNames: 'accounts',
    classNameBindings: 'selected',
    templateName: 'results/customers_table',

    selected: function() {
        return this.get('controller.category') === "account" ? "selected" : "";
    }.property('controller.category')
});

Balanced.FundingInstrumentsResultsView = Balanced.ResultsTableView.extend({
    classNames: 'funding-instruments',
    classNameBindings: 'selected',
    templateName: 'results/funding_instruments_table',

    selected: function() {
        return this.get('controller.category') === "funding_instrument" ? "selected" : "";
    }.property('controller.category')
});
