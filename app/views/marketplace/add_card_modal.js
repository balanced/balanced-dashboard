Balanced.AddCardModalView = Balanced.View.extend({
    templateName: 'modals/add_card',

    validMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    validYears: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],

    expiration_error: function () {
        return this.get('model.validationErrors.expiration_month') || this.get('model.validationErrors.expiration_year');
    }.property('model.validationErrors.expiration_month', 'model.validationErrors.expiration_year'),

    open: function () {
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
        if (this.get('model.isSaving')) {
            return;
        }
        this.set('model.isSaving', true);

        var self = this;
        var card = this.get('model');

        var cardData = {
            card_number: card.get('card_number'),
            expiration_month: card.get('expiration_month'),
            expiration_year: card.get('expiration_year'),
            security_code: card.get('security_code'),
            name: card.get('name')
        };

        // Tokenize the card using the balanced.js library
        balanced.card.create(cardData, function (response) {
            switch (response.status) {
                case 201:
                    self.associateCard(response.data);
                    break;
                case 400:
                    card.set('validationErrors', {});
                    if (response.error.expiration) {
                        card.set('validationErrors.expiration_month', 'invalid');
                    }
                    _.each(response.error, function (value, key) {
                        card.set('validationErrors.' + key, 'invalid');
                    });
                    self.set('model.isSaving', false);
                    break;
                default:
                    card.set('displayErrorDescription', true);
                    var errorSuffix = (response.error && response.error.description) ? (': ' + response.error.description) : '.';
                    card.set('errorDescription', 'Sorry, there was an error tokenizing this card' + errorSuffix);
                    self.set('model.isSaving', false);
                    break;
            }
        });
    },

    associateCard: function(responseData) {
        var self = this;

        // Now that it's been tokenized, we just need to associate it with this customer's account
        var cardAssociation = Balanced.Card.create({
            uri: this.get('customer.cards_uri'),
            card_uri: responseData.uri
        });
        cardAssociation.save().then(function () {
            self.set('model.isSaving', false);
            self.get('customer.cards').reload();
            $('#add-card').modal('hide');
        }, function() {
            self.set('model.displayErrorDescription', true);
            self.set('model.errorDescription', 'Sorry, there was an error associating this card.');
            self.set('model.isSaving', false);
        });
    }
});
