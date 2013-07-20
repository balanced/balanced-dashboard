Balanced.DebitCustomerModalView = Balanced.View.extend({
    templateName: 'modals/debit_customer',

    dollar_amount: null,

    selected_funding_instrument: function () {
        if (this.get('model.source_uri')) {
            return Balanced.FundingInstrument.find(this.get('model.source_uri'));
        }
    }.property('model.source_uri'),

    open: function () {
        var cards = this.get('customer.cards');
        var source_uri = (cards && cards.get('length') > 0) ? cards.get('content')[0].get('uri') : null;

        var debit = Balanced.Debit.create({
            uri: this.get('customer.debits_uri'),
            source_uri: source_uri,
            amount: null
        });

        this.set('dollar_amount', null);
        this.set('model', debit);

        $('#debit-customer').modal('show');
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
            $('#debit-customer').modal('hide');
        });
    }
});
