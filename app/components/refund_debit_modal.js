Balanced.RefundDebitModalComponent = Ember.Component.extend({
    submitAction: 'submitRefundDebit',

    willDestroyElement: function() {
        this.$('.modal').modal('hide');
    },

    open: function () {
        var refund = Balanced.Refund.create({
            uri: this.get('debit.customer.refunds_uri'),
            debit_uri: this.get('debit.uri'),
            amount: null
        });

        var self = this;
        refund.on('didCreate', function() {
            if(self.$('.modal')) {
                self.$('.modal').modal('hide');
            }
        });

        this.set('dollar_amount', this.get('debit.amount_dollars'));
        this.set('model', refund);

        this.$('.modal').modal('show');
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var refund = this.get('model');

        var cents = null;
        try {
            cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
        } catch (error) {
            refund.set('validationErrors', {'amount': error});
            return;
        }
        refund.set('amount', cents);

        this.sendAction('submitAction', refund);
    }
});
