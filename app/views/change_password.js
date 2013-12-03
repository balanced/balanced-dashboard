Balanced.ChangePasswordModalView = Balanced.View.extend({
	templateName: 'modals/change_password',

	actions: {
		open: function() {
			console.log('action open called');
			this.set('model', Balanced.Auth.user);

			this.$('.modal').modal({
				manager: this.$()
			});
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			if (this.get('model.email_address')) {
				var self = this;
				this.get('model').save().then(function() {
					$(".change-password-modal.in").modal('hide');
				});
			}
		},
	}
});
