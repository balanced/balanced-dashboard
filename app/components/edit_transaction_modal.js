Balanced.EditTransactionModalComponent = Ember.Component.extend({
    classNames: ['modal-container', 'header-action-container'],

    willDestroyElement: function() {
        $('.edit-transaction.in').modal('hide');
    },

    open: function () {
        // operate on a copy so we don't mess up the original object
        var copiedTransaction = Ember.copy(this.get('transaction'), true);
        copiedTransaction.set('isNew', false);
        copiedTransaction.trigger('didCreate');
        this.set('model', copiedTransaction);

        this.$('.modal').modal({
            manager: this.$()
        });
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var transaction = this.get('model');
        var self = this;
        transaction.save().then(function() {
            self.get('transaction').updateFromModel(transaction);
            $('.edit-transaction.in').modal('hide');
        });
    }
});
