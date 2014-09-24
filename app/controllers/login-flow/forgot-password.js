import Ember from "ember";

var ForgotPasswordController = Ember.ObjectController.extend({
	needs: ["notification_center"],
	email_address: null,
	hasError: false,

	actions: {
		forgotPass: function() {
			var model = this.get("model");
			var controller = this.get("controllers.notification_center");
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
					self.set('email_address', null);

					self.transitionToRoute('login').then(function(loginRoute) {
						controller.clearAlerts();
						controller.alertSuccess("We've sent you an email with password reset instructions.");
					});
				}, function(response) {
					if (response.detail === 'Not found') {
						controller.clearAlerts();
						controller.alertError("The email address you entered could not be found.");
					}
				});
			} else {
				self.set('hasError', true);
			}
		}
	}
});

export default ForgotPasswordController;
