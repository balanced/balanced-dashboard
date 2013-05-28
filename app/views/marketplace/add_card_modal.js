Balanced.AddCardModalView = Balanced.BaseFormView.extend({
    templateName: 'modals/add_card',

    formProperties: ['name', 'card_number', 'security_code', 'expiration_month', 'expiration_year'],

    validMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    validYears: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],

    expiration_error: function () {
        return this.get('expiration_month_error') || this.get('expiration_year_error');
    }.property('expiration_month_error', 'expiration_year_error'),

    open: function () {
        var card = Balanced.Card.create({
            uri: this.get('marketplace.owner_customer.cards_uri'),
            name: '',
            card_number: '',
            security_code: '',
            expiration_month: '',
            expiration_year: ''
        });
        this.set('model', card);
        this.reset(card);
        $('#add-card').modal('show');
    },

    save: function () {
        var self = this;
        var card = this.get('model');

        card.one('didCreate', function () {
            self.get('marketplace').refresh();
            $('#add-card').modal('hide');
        });
        card.on('becameInvalid', function (json) {
            var jsonObject = JSON.parse(json);
            self.highlightErrorsFromAPIResponse(jsonObject);
        });
        card.create();
    }
});
