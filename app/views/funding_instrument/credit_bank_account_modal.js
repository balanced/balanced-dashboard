Balanced.CreditBankAccountModalView = Balanced.View.extend({
    templateName: 'modals/credit_bank_account',

    dollar_amount: null,

    isSubmitting: false,

    didInsertElement: function () {
        this.get('controller').on('openCreditBankAccountModal', $.proxy(this.open, this));
    },

    open: function () {
        this.set('isSubmitting', false);

        var credit = Balanced.Credit.create({
            uri: this.get('funding_instrument.credits_uri'),
            bank_account_uri: this.get('funding_instrument.uri'),
            amount: null
        });

        this.set('dollar_amount', null);
        this.set('model', credit);

        $('#credit-bank-account').modal('show');
    },

    save: function () {
        if (this.get('isSubmitting')) {
            return;
        }

        this.set('isSubmitting', true);
        var credit = this.get('model');

        var cents = null;
        try {
            cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
        } catch (error) {
            credit.set('validationErrors', {'amount': error});
            this.set('isSubmitting', false);
            return;
        }
        credit.set('amount', cents);

        var self = this;
        credit.create().then(function (credit) {
            self.set('isSubmitting', false);
            $('#credit-bank-account').modal('hide');
        }, function () {
            self.set('isSubmitting', false);
        });
    }
});
