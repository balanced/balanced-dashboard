var Login = Balanced.Model.extend(Ember.Validations, {
	validations: {
		otpCode: {
			presence: true
		}
	}
});

Balanced.Login = Login;
export default Login;
