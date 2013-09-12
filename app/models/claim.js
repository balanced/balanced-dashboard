Balanced.Claim = Balanced.Model.extend(Ember.Validations, {
	uri: '/users',

	validations: {
		email_address: {
			presence: true
		},
		password: {
			presence: true,
			length: {
				minimum: 6
			}
		},
		passwordConfirm: {
			presence: true,
			matches: {
				validator: function(object, attribute, value) {
					var password = object.get('password');
					if (value !== password) {
						object.get('validationErrors').add(attribute, 'invalid');
					}
				}
			}
		}
	}
});

Balanced.Adapter.registerHostForType(Balanced.Claim, ENV.BALANCED.AUTH);

Balanced.Claim.reopenClass({
	serializer: Balanced.Rev0Serializer.create()
});
