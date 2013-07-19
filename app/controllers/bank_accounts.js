Balanced.BankAccountsController = Balanced.ObjectController.extend({
});

Balanced.BankAccountController = Balanced.ObjectController.extend(Ember.Evented, Balanced.DownloadControllerMixin, Balanced.ResultsTable, Balanced.TransactionsTable, {
    needs: ['marketplace'],

    sortField: 'created_at',
    sortOrder: 'desc',

    baseClassSelector: "#bank-account",

    results_base_uri: function () {
        return this.get('content.transactions_uri');
    }.property('content.transactions_uri'),

    openDebitFundingInstrumentModal: function() {
        this.trigger('openDebitFundingInstrumentModal');
    },

    openCreditBankAccountModal: function() {
        this.trigger('openCreditBankAccountModal');
    }
});
