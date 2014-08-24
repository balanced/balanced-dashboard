Balanced.Login = Balanced.Model.extend(Ember.Validations, {
	validations: {
		otpCode: {
			presence: true
		}
	}
});

Balanced.TypeMappings.addTypeMapping('login', 'Balanced.Login');
