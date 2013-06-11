Balanced.Claim = Balanced.Model.extend(Ember.Validations, {
    validations: {
        email_address: {
            presence: true
        },
        password: {
            presence: true,
            length: {minimum: 6}
        },
        passwordConfirm: {
            presence: true,
            matches: {
                validator: function (object, attribute, value) {
                    var password = object.get('password');
                    if (value !== password) {
                        object.get('validationErrors').add(attribute, 'invalid');
                    }
                }
            }
        }
    }
});


Balanced.Login = Balanced.Model.extend({
    uri: '/logins'
});
