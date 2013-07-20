Balanced.VerifyBankAccountModalView = Balanced.View.extend({
    templateName: 'modals/verify_bank_account',

    open: function (bankAccount) {
        this.set('bank_account', bankAccount);

        // operate on a copy so we don't mess up the original object
        var originalVerification = bankAccount.get('verification');
        var verification = Ember.copy(originalVerification, true);
        verification.trigger('didCreate');
        this.set('model', verification);
        $('#verify-bank-account').modal('show');
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var self = this;

        var verification = this.get('model');
        verification.update().then(function () {
            self.get('bank_account').refresh();
            self.get('bank_account.verification').refresh();
            $('#verify-bank-account').modal('hide');
        });
    }
});
