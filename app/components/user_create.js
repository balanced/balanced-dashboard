require('app/components/modal');

Balanced.UserCreateModalComponent = Balanced.ModalComponent.extend({
	submitAction: false,
	hasError: false,
	isSubmitting: false,

	actions: {
		open: function() {
			var inviteUser = Balanced.InviteUser.create({
				uri: this.get('marketplace.users_uri'),
				email_address: ''
			});

			this._super(inviteUser);
		},

		save: function() {
			var self = this;
			var model = this.get('model');

			if (!model.validate()) {
				self.set('hasError', true);
			}

			self.setProperties({
				hasError: false,
				isSubmitting: true
			});

			model.one('becameInvalid', function() {
				self.set('hasError', true);
			});

			model.one('becameError', function() {
				self.set('hasError', true);
			});

			Balanced.APIKey.create({
				meta: {
					name: model.get('email_address')
				}
			}).save().then(function(apiKey) {
				model.set('secret', apiKey.get('secret'));

				model.save().then(function() {
					self.setProperties({
						hasError: false,
						isSubmitting: false
					});

					// Hack to make it reload users
					self.get('userMarketplace').notifyPropertyChange('marketplace');
				}, function() {
					self.setProperties({
						hasError: true,
						isSubmitting: false
					});
				});
			});
		}
	}
});
