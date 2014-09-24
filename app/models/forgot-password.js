import Ember from "ember";
import Rev0Serializer from "../serializers/rev0";
import Model from "./core/model";

var ForgotPassword = Model.extend(Ember.Validations, {
	uri: '/password',

	validations: {
		email_address: {
			presence: true,
			length: {
				minimum: 6
			},
			format: /.+@.+\..{2,4}/
		}
	}
});

ForgotPassword.reopenClass({
	serializer: Rev0Serializer.create()
});

export default ForgotPassword;
