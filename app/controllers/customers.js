Balanced.CustomersController = Balanced.ObjectController.extend({
});

Balanced.CustomerController = Balanced.ObjectController.extend(Ember.Evented, Balanced.DownloadControllerMixin, Balanced.ResultsTable, Balanced.TransactionsTable, {
    needs: ['marketplace'],

    sortField: 'created_at',
    sortOrder: 'desc',

    baseClassSelector: "#customer",

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
