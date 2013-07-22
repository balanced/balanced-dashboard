Balanced.DeleteCallbackModalView = Balanced.View.extend({
    templateName: 'modals/delete_callback',

    didInsertElement: function () {
        this.get('controller').on('openDeleteCallbackModal', $.proxy(this.open, this));
    },

    open: function (callback) {
        this.set('model', callback);
        $('#delete-callback').modal('show');
    },

    deleteCallback: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var self = this;
        this.get('model').delete().then(function () {
            $('#delete-callback').modal('hide');
        });
    }
});
