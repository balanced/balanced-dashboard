Balanced.DebitFundingInstrumentModalView = Balanced.View.extend({
    templateName: 'modals/debit_funding_instrument',

    dollar_amount: null,

    isSubmitting: false,

    didInsertElement: function () {
        this.get('controller').on('openDebitFundingInstrumentModal', $.proxy(this.open, this));
    },

    open: function () {
        this.set('isSubmitting', false);

        var debit = Balanced.Debit.create({
            uri: this.get('funding_instrument.customer.debits_uri'),
            source_uri: this.get('funding_instrument.uri'),
            amount: null
        });

        this.set('dollar_amount', null);
        this.set('model', debit);

        $('#debit-funding-instrument').modal('show');
    },

    save: function () {
        if (this.get('isSubmitting')) {
            return;
        }

        this.set('isSubmitting', true);
        var debit = this.get('model');

        var cents = null;
        try {
            cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
        } catch (error) {
            debit.set('validationErrors', {'amount': error});
            this.set('isSubmitting', false);
            return;
        }
        debit.set('amount', cents);

        var self = this;
        debit.create().then(function (credit) {
            self.set('isSubmitting', false);
            $('#debit-funding-instrument').modal('hide');
        }, function () {
            self.set('isSubmitting', false);
        });
    }
});
