Balanced.LoginController = Balanced.ObjectController.extend({
	email: null,
	password: null,
	loginError: false,
	loginResponse: '',
	otpError: false,
	otpRequired: false,
	otpCode: null,
	from: null,
	isSubmitting: false,

	fromResetPassword: Ember.computed.equal('from', 'ResetPassword'),
	fromForgotPassword: Ember.computed.equal('from', 'ForgotPassword'),

	init: function() {
		if (this.get('auth.signedIn')) {
			this.afterLogin();
		} else {
			this.get('auth').on('signInSuccess', _.bind(this.afterLogin, this));
		}

		this._super();

		this.focus();
	},

	reset: function() {
		this.setProperties({
			loginError: false,
			otpError: false,
			loginResponse: '',
			email: null,
			password: null,
			otpRequired: false,
			otpCode: null,
			from: null,
			isSubmitting: false
		});
	},

	resetError: function() {
		this.setProperties({
			loginError: false,
			otpError: false,
			loginResponse: '',
			from: null,
			isSubmitting: false
		});
	},

	focus: function() {
		$('form input[type=text]:first').focus();
	},

	afterLogin: function() {
		var auth = this.get('auth');
		this.setProperties({
			loginError: false,
			isSubmitting: false
		});

		var attemptedTransition = auth.get('attemptedTransition');

		if (attemptedTransition) {
			Ember.run.next(function() {
				attemptedTransition.retry();
				auth.set('attemptedTransition', null);
				auth.trigger('signInTransition');
			});
		} else {
			this.transitionToRoute('index');
			auth.trigger('signInTransition');
		}
	},

	actions: {
		otpSubmit: function() {
			var self = this;
			var auth = this.get('auth');

			this.set('isSubmitting', true);

			auth.confirmOTP(this.get('otpCode')).then(function() {
				self.afterLogin();
			}, function() {
				auth.forgetLogin();
				self.reset();
				self.setProperties({
					loginError: true,
					loginResponse: 'Invalid OTP code. Please login again.'
				});

				self.focus();
			}).always(function() {
				self.set('isSubmitting', false);
			});
		},

		reset: function() {
			this.resetError();
		},

		signIn: function() {
			var self = this;
			var auth = this.get('auth');

			this.resetError();
			this.set('isSubmitting', true);

			auth.forgetLogin();
			auth.signIn(this.get('email'), this.get('password')).then(function() {
				// When we add the MFA modal to ask users to login
				// self.send('openMFAInformationModal');
				// For now tho:
				self.afterLogin();
			}, function(jqxhr, status, message) {
				self.focus();
				self.set('password', null);

				if (jqxhr.status === 401) {
					self.setProperties({
						loginError: true,
						loginResponse: 'Invalid e-mail address or password.'
					});
					return;
				}

				if (typeof jqxhr.responseText !== "undefined" && jqxhr.responseText) {
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

					// OTP Required Case
					if (jqxhr.status === 409 && responseText.status === 'OTP_REQUIRED') {
						self.set('otpRequired', true);
					} else {
						self.set('loginError', true);

						var error;
						if (typeof responseText.email_address !== 'undefined') {
							error = responseText.email_address[0].replace('This', 'Email');
						} else if (typeof responseText.password !== 'undefined') {
							error = responseText.password[0].replace('This', 'Password');
						} else if (responseText.detail) {
							error = responseText.detail;
						}

						if (error) {
							self.set('loginResponse', error);
						}
					}
				} else if (message || jqxhr.status < 100) {
					message = message.message || message || 'Oops, something went wrong.';

					self.setProperties({
						loginError: true,
						loginResponse: message
					});
				}
			}).always(function() {
				self.set('isSubmitting', false);
			});
		}
	}
});
