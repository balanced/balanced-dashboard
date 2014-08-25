Balanced.LoginController = Balanced.ObjectController.extend({
	needs: ["sessions", "notification_center"],
	email_address: null,
	password: null,
	loginError: false,
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
		signIn: function(model) {
			var self = this;
			var auth = this.get('auth');
			var sessionsController = this.get("controllers.sessions");
			var controller = self.getNotificationController();

			this.resetError();
			this.set('isSubmitting', true);

			sessionsController.nuke();
			sessionsController
				.login(model)
				.then(function(loginUri) {
					auth.set('lastLoginUri', loginUri);
					// When we add the MFA modal to ask users to login
					// self.send('openMFAInformationModal');
					// For now tho:
					self.afterLogin();
				}, function(jqxhr, status, message) {
					self.focus();
					self.set('password', null);

					if (jqxhr.status === 401) {
						self.set("loginError", true);

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
							self.transitionToRoute('otp');

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
