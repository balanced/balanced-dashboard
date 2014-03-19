Balanced.ForgotPassword = Balanced.Model.extend(Ember.Validations, {
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

Balanced.Adapter.registerHostForType(Balanced.ForgotPassword, ENV.BALANCED.AUTH);

Balanced.ForgotPassword.reopenClass({
	serializer: Balanced.Rev0Serializer.create()
});
