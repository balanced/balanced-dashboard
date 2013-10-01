Balanced.ResetPasswordController = Balanced.ObjectController.extend({
	content: null,
	password: null,
	password_confirm: null,
	submitted: false,
	hasError: false,

	actions: {
		resetPassword: function() {
			var model = this.get('content');
			var self = this;

			model.set('uri', '/password/' + this.get('token'));
			model.set('password', this.get('password'));
			model.set('password_confirm', this.get('password_confirm'));

			if (model.validate()) {
				self.set('hasError', false);

				model.one('becameInvalid', function() {
					self.set('hasError', true);
				});

				model.one('becameError', function() {
					self.set('hasError', true);
				});

				model.save().then(function() {
					self.set('password', '');
					self.set('password_confirm', '');
					self.set('submitted', true);
				});
			} else {
				self.set('hasError', true);
			}
		}
	}
});
