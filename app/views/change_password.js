Balanced.ChangePasswordModalView = Balanced.View.extend({
	templateName: 'modals/change_password',

	didInsertElement: function() {
		var controller = this.get('controller');
		if (!controller.on) {
			return;
		}

		controller.on('openChangePasswordModal', this, this.open);
		this._super();
	},

	willDestroyElement: function() {
		var controller = this.get('controller');
		if (!controller.off) {
			return;
		}

		controller.off('openChangePasswordModal', this, this.open);
		this._super();
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
				Balanced.Auth.get('user').reload();
			}, function() {
				user.setProperties({
					displayErrorDescription: true,
					errorDescription: 'Oops, we failed to change your password. Please try again.'
				});
			});
		}
	}
});
