Balanced.InviteUser = Balanced.Model.extend(Ember.Validations, {
	validations: {
		email_address: {
			presence: true,
			length: {
				minimum: 6
			},
			format: /.+@.+\..{2,4}/
		}
	},

	delete: function(settings) {
		settings = _.extend({
			data: {
				email_address: this.get('email_address')
			}
		}, settings || {});

		return this._super(settings);
	}
});

Balanced.Adapter.registerHostForType(Balanced.InviteUser, ENV.BALANCED.AUTH);

Balanced.InviteUser.reopenClass({
	serializer: Balanced.Rev0Serializer.create()
});
