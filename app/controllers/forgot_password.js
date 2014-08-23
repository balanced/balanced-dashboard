Balanced.ForgotPasswordController = Balanced.ObjectController.extend({
	needs: ["notification_center"],
	content: null,
	email_address: null,
	submitted: false,
	hasError: false,

	actions: {
		forgotPass: function() {
			var model = this.get("model");
			var self = this;

			model.set('email_address', model.get('email_address'));

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
						var controller = self.get("controllers.notification_center");
						controller.clearAlerts();
						controller.alertSuccess("We've sent you an email with password reset instructions.");
					});
				});
			} else {
				self.set('hasError', true);
			}
		}
	}
});
