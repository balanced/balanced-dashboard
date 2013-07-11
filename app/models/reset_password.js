Balanced.ResetPassword = Balanced.Model.extend(Ember.Validations, {
    validations: {
        password: {
            presence: true,
            length: {
                minimum: 6
            },
            format: {
                validator: function (object, attribute, value) {
                    if (!Balanced.Utils.isValidPassword(value)) {
                        object.set('hasError', true);
                        object.get('validationErrors').add(attribute, 'invalid');
                    }
                }
            }
        },
        password_confirm: {
            presence: true,
            length: {
                minimum: 6
            },
            format: {
                validator: function (object, attribute, value) {
                    var password = object.get('password');
                    if (value !== password) {
                        object.set('hasError', true);
                        object.get('validationErrors').add(attribute, 'invalid');
                    }
                }
            }
        }
    }
});