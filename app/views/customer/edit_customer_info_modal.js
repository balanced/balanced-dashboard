Balanced.EditCustomerInfoModalView = Balanced.View.extend({
    templateName: 'modals/edit_customer_info',

    classNames: ['modal-container', 'header-action-container'],

    marketplaceOwner: false,
    optionalFieldsOpen: false,

    dob_month: "",
    dob_year: "",

    willDestroyElement: function() {
        this.$('.modal').modal('hide');
    },

    open: function () {
        var customer = Ember.copy(this.get('customer'), true);
        customer.set('isNew', false);
        customer.trigger('didCreate');

        this.set('model', customer);

        this.set('dob_month', customer.get('dob_month'));
        this.set('dob_year', customer.get('dob_year'));

        this.set('optionalFieldsOpen', false);
        $('#edit-customer-info').modal('show');
    },

    toggleOptionalFields: function () {
        this.set('optionalFieldsOpen', !this.get('optionalFieldsOpen'));
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var self = this;
        var customer = this.get('model');

        customer.updateDob(this.get('dob_month'), this.get('dob_year'));

        if(customer.get('email') === '') {
            customer.set('email', null);
        }

        customer.save().then(function () {
            self.get('customer').reload();
            $('#edit-customer-info').modal('hide');
        });
    }
});
