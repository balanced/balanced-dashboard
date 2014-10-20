import LoginController from "./login";

var OtpController = LoginController.extend({
	otpCode: null,

	actions: {
		otpSubmit: function(model) {
			var self = this;
			var auth = this.get('auth');
			var controller = self.getNotificationController();

			model.validate();
			if (!model.get("isValid")) {
				controller.alertError("Authentication code can't be blank.");
				return;
			}

			this.set('otpCode', model.get('otpCode'));
			this.set('isSubmitting', true);

			auth.confirmOTP(this.get('otpCode'))
				.then(function() {
					self.afterLogin();
				}, function(error) {
					auth.forgetLogin();
					self.set("otpCode", null);

					var MESSAGES = {
						"You need to pass in a confirm token to continue login": "Authentication code is blank.",
						"Not found": "Authentication has expired. Please enter your email address and password again.",
						"Invalid OTP verification": "The authentication code you entered is invalid. Please log in again."
					};

					var message = "There was an unknown error submitting your authentication code.";

					if (error.responseJSON) {
						message = MESSAGES[error.responseJSON.detail];
					}

					controller.clearAlerts();
					controller.alertError(message);

					self.focus();
				})
				.finally(function() {
					self.set('isSubmitting', false);
				});
		},
	}
});

export default OtpController;
