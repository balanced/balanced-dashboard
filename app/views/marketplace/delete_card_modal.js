Balanced.DeleteCardModalView = Balanced.View.extend({
    templateName: 'modals/delete_card',

    didInsertElement: function () {
        this.get('controller').on('openDeleteCardModal', $.proxy(this.open, this));
    },

    open: function (card) {
        this.set('model', card);
        $('#delete-card').modal('show');
    },

    deleteCard: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var self = this;
        this.get('model').delete().then(function () {
            $('#delete-card').modal('hide');
        });
    }
});
