Balanced.InitialDeposit = Balanced.Model.extend(Ember.Validations, {
    validations: {
        card_number: {
            presence: true,
            format: {
                validator: function (object, attribute, value) {
                    if (!balanced.card.isCardNumberValid(value)) {
                        object.get('validationErrors').add(attribute, 'blank', null, 'is not valid');
                    }
                }
            }
        },
        expiration_month: {
            presence: true
        },
        expiration_year: {
            presence: true
        },
        security_code: {
            presence: true,
            numericality: true,
            length: {
                minimum: 3,
                maximum: 4
            }
        },
        postal_code: {

        }
    }
});
