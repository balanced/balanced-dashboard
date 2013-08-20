Balanced.VerifyBankAccountModalView = Balanced.View.extend({
    templateName: 'modals/verify_bank_account',

    open: function (bankAccount) {
        var self = this;

        this.set('bank_account', bankAccount);

        var originalVerification = bankAccount.get('verification');

        var after = function (verification) {
            self.set('model', verification);
            $('#verify-bank-account').modal('show');
        };

        if(originalVerification) {
            var newVerification = Ember.copy(originalVerification, true);
            after(newVerification);
        } else {
            Balanced.Verification.create({
                uri: bankAccount.get('verifications').uri
            }).create().then(after);
        }
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var self = this;

        var verification = this.get('model');
        verification.update().then(function () {
            self.get('bank_account').reload();
            self.get('bank_account.verification').reload();
            $('#verify-bank-account').modal('hide');
        });
    }
});
