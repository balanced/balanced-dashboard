Balanced.ChangePasswordModalView = Balanced.View.extend({
	templateName: 'modals/change_password',

	didInsertElement: function() {
		if (!this.get('controller').on) {
			return;
		}

		this.get('controller').on('openChangePasswordModal', this, this.open);
	},

	willDestroyElement: function() {
		if (!this.get('controller').off) {
			return;
		}

		this.get('controller').off('openChangePasswordModal', this, this.open);
	},

	open: function() {
		var user = Ember.copy(Balanced.Auth.user, true);
		this.set('model', user);

		this.$('.modal').modal({
			manager: this.$()
		});
	},

	actions: {
		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var user = this.get('model');
			_.each(user, function(val, key) {
				if (!val) {
					this.set(key, undefined);
				}
			}, user);

			if (user.get('password') && user.get('password') !== user.get('confirm_password')) {
				user.setProperties({
					validationErrors: {
						password: true,
						confirm_password: true
					},
					displayErrorDescription: true,
					errorDescription: 'Passwords are different'
				});
				return;
			}

			if (!user.get('existing_password')) {
				user.setProperties({
					validationErrors: {
						existing_password: true
					},
					displayErrorDescription: true,
					errorDescription: 'Need your existing password.'
				});
				return;
			}

			if (!user.get('email_address')) {
				user.setProperties({
					validationErrors: {
						email_address: true
					},
					displayErrorDescription: true,
					errorDescription: 'You need an email address associated with your account'
				});
				return;
			}

			user.setProperties({
				validationErrors: {},
				displayErrorDescription: null,
				errorDescription: ''
			});

			user.save().then(function() {
				$(".change-password-modal.in").modal('hide');
			});
		}
	}
});
