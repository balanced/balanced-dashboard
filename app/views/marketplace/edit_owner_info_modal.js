Balanced.EditOwnerInfoModalView = Balanced.View.extend({
    templateName: 'modals/edit_owner_info',

    isSubmitting: false,

    open: function () {
        this.set('isSubmitting', false);
        var customer = Ember.copy(this.get('content'), true);
        customer.trigger('didCreate');
        this.set('model', customer);
        $('#edit-owner-info').modal('show');
    },

    save: function () {
        if(this.get('isSubmitting')) {
            return;
        }
        this.set('isSubmitting', true);
        var self = this;

        var customer = this.get('model');

        customer.update().then(function() {
            self.set('isSubmitting', false);
            self.content.updateFromModel(customer);
            $('#edit-owner-info').modal('hide');
        }, function() {
            self.set('isSubmitting', false);
        });
    }
});
