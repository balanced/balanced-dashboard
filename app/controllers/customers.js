Balanced.CustomersController = Balanced.ObjectController.extend({
});

Balanced.CustomerController = Balanced.ObjectController.extend(Balanced.DownloadControllerMixin, Balanced.ResultsTable, {
	needs: ['marketplace'],

	sortField: 'created_at',
    sortOrder: 'desc',

    baseClassSelector: "#customer",

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
