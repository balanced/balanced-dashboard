var Login = Balanced.Model.extend(Ember.Validations, {
	validations: {
		otpCode: {
			presence: true
		}
	}
});

export default Login;
