import Ember from "ember";
import Model from "./core/model";

var Login = Model.extend(Ember.Validations, {
	validations: {
		otpCode: {
			presence: true
		}
	}
});

export default Login;
