import Ember from "ember";
import Model from "./core/model";
import Rev0Serializer from "../serializers/rev0";
import Constants from "balanced-dashboard/utils/constants";

var ResetPassword = Model.extend(Ember.Validations, {
	validations: {
		password: {
			presence: true,
			length: {
				minimum: Constants.PASSWORD.MIN_CHARS
			},
			format: {
				with: Constants.PASSWORD.REGEX
			}
		},
		password_confirm: {
			presence: true,
			length: {
				minimum: Constants.PASSWORD.MIN_CHARS
			},
			format: {
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

ResetPassword.reopenClass({
	serializer: Rev0Serializer.create()
});

export default ResetPassword;
