Balanced.CaptureHoldModalComponent = Ember.Component.extend({
    submitAction: 'submitCaptureHold',

    willDestroyElement: function() {
        this.$('.modal').modal('hide');
    },

    open: function () {
        var debit = Balanced.Debit.create({
            uri: this.get('hold.customer.debits_uri'),
            hold_uri: this.get('hold.uri'),
            amount: null
        });

        var self = this;
        debit.on('didCreate', function() {
            if(self.$('.modal')) {
                self.$('.modal').modal('hide');
            }
        });

        this.set('dollar_amount', null);
        this.set('model', debit);

        this.$('.modal').modal('show');
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

        this.sendAction('submitAction', debit);
    }
});
