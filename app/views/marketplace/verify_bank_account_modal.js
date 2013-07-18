Balanced.VerifyBankAccountModalView = Balanced.View.extend({
    templateName: 'modals/verify_bank_account',

    isSubmitting: false,

    open: function (bankAccount) {
        this.set('isSubmitting', false);
        this.set('bank_account', bankAccount);

        // operate on a copy so we don't mess up the original object
        var originalVerification = bankAccount.get('verification');
        var verification = Ember.copy(originalVerification, true);
        verification.trigger('didCreate');
        this.set('model', verification);
        $('#verify-bank-account').modal('show');
    },

    save: function () {
        if (this.get('isSubmitting')) {
            return;
        }
        this.set('isSubmitting', true);

        var self = this;

        var verification = this.get('model');
        verification.update().then(function () {
            self.set('isSubmitting', false);
            self.get('bank_account').refresh();
            self.get('bank_account.verification').refresh();
            $('#verify-bank-account').modal('hide');
        }, function () {
            self.set('isSubmitting', false);
        });
    }
});
