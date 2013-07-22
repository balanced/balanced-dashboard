Balanced.DebitFundingInstrumentModalView = Balanced.View.extend({
    templateName: 'modals/debit_funding_instrument',

    dollar_amount: null,

    didInsertElement: function () {
        this.get('controller').on('openDebitFundingInstrumentModal', $.proxy(this.open, this));
    },

    open: function () {
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
        if (this.get('model.isSaving')) {
            return;
        }

        var debit = this.get('model');

        var cents = null;
        try {
            cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
        } catch (error) {
            debit.set('validationErrors', {'amount': error});
            return;
        }
        debit.set('amount', cents);

        var self = this;
        debit.create().then(function (credit) {
            $('#debit-funding-instrument').modal('hide');
        });
    }
});
