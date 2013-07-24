Balanced.VerifyBankAccountModalView = Balanced.View.extend({
    templateName: 'modals/verify_bank_account',

    didInsertElement: function () {
        this.get('controller').on('openVerifyBankAccountModal', this, this.open);
    },

    willDestroyElement: function () {
        this.get('controller').off('openVerifyBankAccountModal', this, this.open);
    },

    open: function () {
        var verification = Balanced.Verification.create({
            uri: this.get('funding_instrument.verifications_uri')
        });
        this.set('model', verification);

        $('#verify-bank-account').modal('show');
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var verification = this.get('model');

        var self = this;
        verification.create().then(function (verification) {
            $('#verify-bank-account').modal('hide');
        }, function() {
            $('#verify-bank-account').modal('hide');
        });
    }
});
