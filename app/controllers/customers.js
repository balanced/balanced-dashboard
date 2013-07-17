Balanced.CustomersController = Balanced.ObjectController.extend({
});

Balanced.CustomerController = Balanced.ObjectController.extend(Ember.Evented, Balanced.DownloadControllerMixin, Balanced.ResultsTable, {
    needs: ['marketplace'],

    sortField: 'created_at',
    sortOrder: 'desc',

    transactionType: 'all',

    baseClassSelector: "#customer",

    extra_filtering_params: function () {
        var transactionType = this.get('transactionType');
        if (transactionType === 'all') {
            return {};
        }
        return {
            state: transactionType
        };
    }.property('transactionType'),

    changeTransactionTypeFilter: function (type, transactionType) {
        this.setProperties({
            type: type,
            transactionType: transactionType
        });
    },

    promptToDeleteBankAccount: function (bankAccount) {
        this.trigger('openDeleteBankAccountModal', bankAccount);
    },

    promptToDeleteCard: function (card) {
        this.trigger('openDeleteCardModal', card);
    },

    results_base_uri: function () {
        return this.get('content.transactions_uri');
    }.property('content.transactions_uri')
});
