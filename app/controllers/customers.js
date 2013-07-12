Balanced.CustomersController = Balanced.ObjectController.extend({
});

Balanced.CustomerController = Balanced.ObjectController.extend(Balanced.DownloadControllerMixin, Balanced.ResultsTable, {
	needs: ['marketplace'],

	sortField: 'created_at',
    sortOrder: 'desc',

    transactionType: 'all',

    baseClassSelector: "#customer",

    extra_filtering_params: function() {
        var transactionType = this.get('transactionType');
        if (transactionType === 'all') {
            return {};
        } else {
            return {
                state: transactionType
            };
        }
    }.property('transactionType'),

    changeTransactionTypeFilter: function(type, transactionType) {
        this.setProperties({
            type: type,
            transactionType: transactionType
        });
    },

    promptToDeleteBankAccount: function (bankAccount) {
        this.bankAccount = bankAccount;
        $('#delete-bank-account').modal('show');
    },

    deleteBankAccount: function () {
        this.bankAccount.delete();
        $('#delete-bank-account').modal('hide');
    },

    promptToDeleteCard: function (card) {
        this.card = card;
        $('#delete-card').modal('show');
    },

    deleteCard: function () {
        this.card.delete();
        $('#delete-card').modal('hide');
    },

    results_base_uri: function() {
        return this.get('content.transactions_uri');
    }.property('content.transactions_uri')
});
