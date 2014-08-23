Balanced.LoginController = Balanced.ObjectController.extend({
	needs: ["sessions", "notification_center"],
	email_address: null,
	password: null,
	loginError: false,
	otpRequired: false,
	otpCode: null,
	isSubmitting: false,

	init: function() {
		this.getNotificationController().clearAlerts();
		this._super();
		this.focus();
	},

	reset: function() {
		this.setProperties({
			email_address: null,
			password: null,
			loginError: false,
			otpRequired: false,
			otpCode: null,
			isSubmitting: false
		});
	},

	resetError: function() {
		this.setProperties({
			loginError: false,
			isSubmitting: false
		});
	},

	focus: function() {
		$('form input:first').focus();
	},

	afterLogin: function() {
		var self = this;

		Ember.run(function() {
			self.setProperties({
				loginError: false,
				isSubmitting: false
			});
		});
		this.getNotificationController().clearAlerts();
		this.get("controllers.sessions").send("afterLoginTransition");
	},

	getNotificationController: function() {
		return this.get("controllers.notification_center");
	},

	actions: {
		otpSubmit: function() {
			var self = this;
			var auth = this.get('auth');

			this.set('isSubmitting', true);

			auth.confirmOTP(this.get('otpCode'))
				.then(function() {
					self.afterLogin();
				}, function(error) {
					auth.forgetLogin();
					self.reset();
					self.set("loginError", true);

					var MESSAGES = {
						"You need to pass in a confirm token to continue login": "Authentication code is blank.",
						"Not found": "OTP verification has expired. Please enter your email address and password again.",
						"Invalid OTP verification": "The authentication code you entered is invalid. Please log in again."
					}
					var message = "There was an unknown error submitting your OTP.";
					var controller = self.getNotificationController();

					if (error.responseJSON.detail) {
						message = MESSAGES[error.responseJSON.detail];
					}

					controller.clearAlerts();
					controller.alertError(message);

					self.focus();
				})
				.
			finally(function() {
				self.set('isSubmitting', false);
			});
		},

		reset: function() {
			this.resetError();
		},

		signUp: function() {
			Balanced.Analytics.trackEvent("SignUp: Opened 'Create an account'", {
				path: "login"
			});
			this.transitionToRoute('setup_guest_user');
		},

		signIn: function(model) {
			var self = this;
			var sessionsController = this.get("controllers.sessions");

			this.resetError();
			this.set('isSubmitting', true);
			sessionsController.nuke();
			sessionsController
				.login(model)
				.then(function() {
					// When we add the MFA modal to ask users to login
					// self.send('openMFAInformationModal');
					// For now tho:
					self.afterLogin();
				}, function(jqxhr, status, message) {
					self.focus();
					self.set('password', null);

					if (jqxhr.status === 401) {
						self.set("loginError", true);

						var controller = self.getNotificationController();
						controller.clearAlerts();
						controller.alertError("The e-mail address or password you entered is invalid.");

						return;
					}

					if (jqxhr.responseText !== "undefined" && jqxhr.responseText) {
						var responseText = jqxhr.responseJSON;

						// What if responseJSON is null/undefined:
						// 1. Try to parse it ourselves
						// 2. If all else fails, assume that the responseText
						//    is the error message to be shown
						if (!responseText) {
							try {
								responseText = JSON.parse(jqxhr.responseText);
							} catch (e) {
								responseText = {
									detail: jqxhr.responseText
								};
							}
						}

						if (jqxhr.status === 409 && responseText.status === 'OTP_REQUIRED') {
							self.set('otpRequired', true);
						} else {
							self.set('loginError', true);

							var error;
							if (typeof responseText.email_address !== 'undefined') {
								error = responseText.email_address[0].replace('This field', 'Email address');
							} else if (typeof responseText.password !== 'undefined') {
								error = responseText.password[0].replace('This field', 'Password');
							} else if (responseText.detail) {
								error = responseText.detail;
							}

							if (error) {
								var controller = self.getNotificationController();
								controller.clearAlerts();
								controller.alertError(error);
							}
						}
					} else if (message || jqxhr.status < 100) {
						message = message.message || message || 'Oops, something went wrong.';

						self.set("loginError", true);

						var controller = self.getNotificationController();
						controller.clearAlerts();
						controller.alertError(message);
					}
				})
				.finally(function() {
					self.set('isSubmitting', false);
				});
		}
	}
});
