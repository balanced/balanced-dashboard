Balanced.BankAccountsController = Balanced.ObjectController.extend({
});

Balanced.BankAccountController = Balanced.ObjectController.extend(
    Ember.Evented,
    Balanced.DownloadControllerMixin,
    Balanced.ResultsTable,
    Balanced.TransactionsTable,
    {
        needs: ['marketplace'],

        sortField: 'created_at',
        sortOrder: 'desc',

        baseClassSelector: "#bank-account",

        results_base_uri: function () {
            return this.get('content.transactions_uri');
        }.property('content.transactions_uri'),

        openDebitFundingInstrumentModal: function () {
            this.trigger('openDebitFundingInstrumentModal');
        },

        openCreditBankAccountModal: function () {
            this.trigger('openCreditBankAccountModal');
        },

        openVerifyBankAccountModal: function() {
            this.trigger('openVerifyBankAccountModal');
        },

        openConfirmVerificationModal: function() {
            this.trigger('openConfirmVerificationModal');
        },

        can_debit_or_verify: function() {
            return this.get('content.can_debit') || this.get('content_can_verify');
        }
    }
);
