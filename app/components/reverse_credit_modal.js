Balanced.ReverseCreditModalComponent = Ember.Component.extend({
    submitAction: 'submitReverseCredit',
    classNames: ['modal-container'],

    willDestroyElement: function() {
        $('#reverse-credit').modal('hide');
    },

    open: function () {
        var reversal = Balanced.Reversal.create({
            uri: this.get('credit.reversals_uri'),
            credit_uri: this.get('credit.uri'),
            amount: this.get('credit.amount')
        });

        var self = this;
        reversal.on('didCreate', function() {
            $('#reverse-credit').modal('hide');
        });

        this.set('model', reversal);

        $('#reverse-credit').modal('show');
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var reversal = this.get('model');
        this.sendAction('submitAction', reversal);
    }
});
