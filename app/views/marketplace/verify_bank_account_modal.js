Balanced.VerifyBankAccountModalView = Balanced.BaseFormView.extend({
    templateName: 'modals/verify_bank_account',

    formProperties: ['amount_1', 'amount_2'],

    open: function (bankAccount) {
        var self = this;

        this.set('bank_account', bankAccount);

        var originalVerification = bankAccount.get('verification');

        var verification;
        if(originalVerification) {
            // operate on a copy so we don't mess up the original object
            verification = Ember.copy(originalVerification, true);
            self.set('model', verification);
            self.reset(verification);
            $('#verify-bank-account').modal('show');
        } else {
            Balanced.Verification.create({
                uri: bankAccount.get('verifications').uri
            }).create().then(function(newVerification) {
                verification = Ember.copy(newVerification, true);
                self.set('model', verification);
                self.reset(verification);
                $('#verify-bank-account').modal('show');
            });
        }
    },

    save: function () {
        var self = this;

        var verification = this.get('model');

        verification.one('didUpdate', function () {
            self.bank_account.refresh();
            $('#verify-bank-account').modal('hide');
        });
        verification.one('becameInvalid', function (json) {
            var jsonObject = JSON.parse(json);
            self.highlightErrorsFromAPIResponse(jsonObject);
        });
        verification.update();
    }
});
