Balanced.MarketplaceAddCustomerController = Balanced.ObjectController.extend({
    needs: ["marketplace"],

    optionalFieldsOpen: false,

    save: function() {
        if (this.get('model.isSaving')) {
            return;
        }

        var self = this;
        var customer = this.get('model');

        customer.updateDob(this.get('dob_month'), this.get('dob_year'));

        for(var prop in customer) {
            if(customer.hasOwnProperty(prop) && customer[prop] === '') {
                customer.set(prop, null);
            }
        }

        customer.create().then(function(customer) {
            self.transitionToRoute('customer', customer);
        });
    },

    selectType: function (applicationType) {
        this.set('applicationType', applicationType);

        var cls = 'selected';
        $('a', '.application-type').removeClass(cls).parent().find('.' + applicationType.toLowerCase()).addClass(cls);
    },

    selectedType: function () {
        return this.get('applicationType');
    }.property('applicationType'),

    isBusiness: function () {
        return this.get('applicationType') === 'BUSINESS';
    }.property('applicationType'),

    toggleOptionalFields: function() {
        this.set('optionalFieldsOpen', !this.get('optionalFieldsOpen'));
    },

    submitTitle: function() {
        if(this.get('model.isSaving')) {
            return "Submitting..."
        } else {
            return "Submit";
        }
    }.property('model.isSaving')
});
