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

			var baseUri = location.hash.indexOf('invite') > 0 ? '/invite/' : '/password/';

			model.setProperties({
				uri: baseUri + this.get('token'),
				password: this.get('password'),
				password_confirm: this.get('password_confirm')
			});

			if (model.validate()) {
				self.set('hasError', false);

				model.one('becameInvalid', function() {
					self.set('hasError', true);
				});

				model.one('becameError', function() {
					self.set('hasError', true);
				});

				model.save().then(function() {
					self.setProperties({
						password: '',
						password_confirm: '',
						submitted: true
					});

					self.transitionToRoute('login').then(function(loginRoute) {
						loginRoute.controller.set('from', 'ResetPassword');
					});
				});
			} else {
				self.set('hasError', true);
			}
		}
	}
});
