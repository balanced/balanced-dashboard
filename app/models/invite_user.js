Balanced.InviteUser = Balanced.Model.extend(Ember.Validations, {
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

Balanced.Adapter.registerHostForType(Balanced.InviteUser, ENV.BALANCED.AUTH);

Balanced.InviteUser.reopenClass({
	serializer: Balanced.Rev0Serializer.create()
});
