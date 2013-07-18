Balanced.VerifyBankAccountModalView = Balanced.BaseFormView.extend({
    templateName: 'modals/verify_bank_account',

    formProperties: ['amount_1', 'amount_2'],

    open: function (bankAccount) {
        var self = this;

        this.set('bank_account', bankAccount);

        var originalVerification = bankAccount.get('verification');

        if(originalVerification) {
            var newVerification = Ember.copy(originalVerification, true);
            self.set('model', newVerification);
            self.reset(newVerification);
            $('#verify-bank-account').modal('show');
        } else {
            console.log("creating a verification");

            Balanced.Verification.create({
                uri: bankAccount.get('verifications').uri
            }).create().then(function(verification) {
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
