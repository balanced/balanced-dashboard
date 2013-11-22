Balanced.ForgotPassword = Balanced.Model.extend(Ember.Validations, {
	uri: '/password',

	validations: {
		email_address: {
			presence: true
		}
	}
});

Balanced.Adapter.registerHostForType(Balanced.ForgotPassword, ENV.BALANCED.AUTH);

Balanced.ForgotPassword.reopenClass({
	serializer: Balanced.Rev0Serializer.create()
});
