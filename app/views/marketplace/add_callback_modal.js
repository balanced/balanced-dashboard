Balanced.AddCallbackModalView = Balanced.View.extend({
    templateName: 'modals/add_callback',

    open: function () {
        var callback = Balanced.Callback.create({
            uri: this.get('marketplace').get('callbacks_uri'),
            url: ''
        });
        this.set('model', callback);
        $('#add-callback').modal('show');
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var self = this;
        var callback = this.get('model');

        callback.create().then(function () {
            self.get('marketplace.callbacks').refresh();
            $('#add-callback').modal('hide');
        });
    }
});
