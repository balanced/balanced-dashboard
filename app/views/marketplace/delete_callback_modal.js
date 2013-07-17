Balanced.DeleteCallbackModalView = Balanced.View.extend({
    templateName: 'modals/delete_callback',

    isSubmitting: false,

    didInsertElement: function() {
    	this.get('controller').on('openDeleteCallbackModal', $.proxy(this.open, this));
    },

    open: function(callback) {
    	this.set('isSubmitting', false);
    	this.set('model', callback);
        $('#delete-callback').modal('show');
    },

    deleteCallback: function () {
    	if(this.get('isSubmitting')) {
    		return;
    	}

        var self = this;
        this.set('isSubmitting', true);
        this.get('model').delete().then(function() {
            self.set('isSubmitting', false);
            $('#delete-callback').modal('hide');
        }, function() {
            self.set('isSubmitting', false);
        });
    }
});
