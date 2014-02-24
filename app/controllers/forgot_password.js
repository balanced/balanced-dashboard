Balanced.ForgotPasswordController = Balanced.ObjectController.extend({
	content: null,
	email_address: null,
	submitted: false,
	hasError: false,

	actions: {
		forgotPass: function() {
			var model = this.get('content');
			var self = this;

			model.set('email_address', this.get('email_address'));

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
						email_address: '',
						submitted: true
					});

					self.transitionToRoute('login').then(function(loginRoute) {
						loginRoute.controller.set('fromForgotPassword', true);
					});
				});
			} else {
				self.set('hasError', true);
			}
		}
	}
});
