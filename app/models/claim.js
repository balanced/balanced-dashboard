import Rev0Serializer from "../serializers/rev0";
import Model from "./core/model";

var Claim = Model.extend(Ember.Validations, {
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

Claim.reopenClass({
	serializer: Rev0Serializer.create()
});

export default Claim;
