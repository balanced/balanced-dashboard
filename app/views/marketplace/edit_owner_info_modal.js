Balanced.EditOwnerInfoModalView = Balanced.View.extend({
    templateName: 'modals/edit_owner_info',

    open: function () {
        var customer = Ember.copy(this.get('content'), true);
        customer.set('isNew', false);
        customer.trigger('didCreate');
        this.set('model', customer);
        $('#edit-owner-info').modal('show');
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }
        var self = this;

        var customer = this.get('model');

        customer.save().then(function () {
            self.content.updateFromModel(customer);
            $('#edit-owner-info').modal('hide');
        });
    }
});
