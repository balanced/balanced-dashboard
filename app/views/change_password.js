Balanced.ChangePasswordModalView = Balanced.View.extend({
	templateName: 'modals/change_password',

	didInsertElement: function() {
		this.get('controller').on('openChangePasswordModal', this, this.open);
	},

	willDestroyElement: function() {
		this.get('controller').off('openChangePasswordModal', this, this.open);
	},

	open: function() {
		var user = Ember.copy(Balanced.Auth.get('user'), true);
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

			//  bug in ember-validation requires this extra check for length
			if (!user.validate() && user.get('validationErrors.length')) {
				user.setProperties({
					displayErrorDescription: true,
					errorDescription: 'Please fix the errors below.'
				});
				return;
			}

			// Turn off errors
			user.setProperties({
				displayErrorDescription: false,
				errorDescription: ''
			});

			// Save the user
			user.save().then(function() {
				$(".change-password-modal.in").modal('hide');
				Balanced.Auth.get('user').send('reload');
			});
		}
	}
});
