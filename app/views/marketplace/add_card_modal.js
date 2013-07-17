Balanced.AddCardModalView = Balanced.View.extend({
    templateName: 'modals/add_card',

    validMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    validYears: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],

    isSubmitting: false,

    expiration_error: function () {
        return this.get('model.validationErrors.expiration_month') || this.get('model.validationErrors.expiration_year');
    }.property('model.validationErrors.expiration_month', 'model.validationErrors.expiration_year'),

    open: function () {
        this.set('isSubmitting', false);
        var card = Balanced.Card.create({
            uri: this.get('customer.cards_uri'),
            name: '',
            card_number: '',
            security_code: '',
            expiration_month: '',
            expiration_year: ''
        });
        this.set('model', card);
        $('#add-card').modal('show');
    },

    save: function () {
        if(this.get('isSubmitting')) {
            return;
        }
        this.set('isSubmitting', true);

        var self = this;
        var card = this.get('model');

        card.create().then(function() {
            self.set('isSubmitting', false);
            self.get('customer.cards').refresh();
            $('#add-card').modal('hide');
        }, function() {
            self.set('isSubmitting', false);
        });
    }
});
