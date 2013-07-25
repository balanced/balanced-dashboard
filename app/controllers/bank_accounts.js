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

        init: function () {
            var self = this;
            Balanced.Model.Events.on('didCreate', this, this.refresh_verifications);
            Balanced.Model.Events.on('didUpdate', this, this.refresh_verifications);
        },

        refresh_verifications: function(object) {
            if(Balanced.Verification.prototype.isPrototypeOf(object) && this.get('content')) {
                var self = this;
                this.get('content').refresh().then(function() {
                    self.get('verification').refresh();
                    self.get('verifications').refresh();
                });
            }
        },

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
            return this.get('content.can_debit') || this.get('content.can_verify');
        }.property('content.can_debit', 'content.can_verify')
    }
);
