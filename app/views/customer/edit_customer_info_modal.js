Balanced.EditCustomerInfoModalView = Balanced.View.extend({
    templateName: 'modals/edit_customer_info',

    optionalFieldsOpen: false,

    dob_month: "",
    dob_year: "",

    open: function () {
        var customer = Ember.copy(this.get('customer'), true);
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
        var self = this;
        var customer = this.get('model');
        var month = this.get('dob_month');
        var year = this.get('dob_year');
        if ((month && month.length > 0) || (year && year.length > 0)) {
            customer.set('dob', year + '-' + month);
        } else {
            customer.set('dob', null);
        }
        customer.update().then(function () {
            self.get('customer').refresh();
            $('#edit-customer-info').modal('hide');
        });
    }
});
