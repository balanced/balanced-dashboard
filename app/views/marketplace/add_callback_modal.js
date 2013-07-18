Balanced.AddCallbackModalView = Balanced.View.extend({
    templateName: 'modals/add_callback',

    isSubmitting: false,

    open: function () {
        this.set('isSubmitting', false);
        var callback = Balanced.Callback.create({
            uri: this.get('marketplace').get('callbacks_uri'),
            url: ''
        });
        this.set('model', callback);
        $('#add-callback').modal('show');
    },

    save: function () {
        if(this.get('isSubmitting')) {
            return;
        }
        this.set('isSubmitting', true);

        var self = this;
        var callback = this.get('model');

        callback.create().then(function() {
            self.set('isSubmitting', false);
            self.get('marketplace.callbacks').refresh();
            $('#add-callback').modal('hide');
        }, function() {
            self.set('isSubmitting', false);
        });
    }
});
