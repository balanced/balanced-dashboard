Balanced.EditTransactionModalComponent = Ember.Component.extend({
    classNames: ['header-action-container'],

    willDestroyElement: function() {
        this.$('.modal').modal('hide');
    },

    open: function () {
        // operate on a copy so we don't mess up the original object
        var copiedTransaction = Ember.copy(this.get('transaction'), true);
        copiedTransaction.trigger('didCreate');
        this.set('model', copiedTransaction);

        this.$('.modal').modal('show');
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var transaction = this.get('model');
        var self = this;
        transaction.update().then(function() {
            self.get('transaction').updateFromModel(transaction);
            self.$('.modal').modal('hide');
        });
    }
});
