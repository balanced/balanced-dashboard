Balanced.LoginController = Balanced.ObjectController.extend({
	email: null,
	password: null,
	loginError: false,
	loginResponse: '',
	otpError: false,
	otpRequired: false,
	otpCode: null,

	reset: function() {
		this.setProperties({
			loginError: false,
			otpError: false,
			loginResponse: '',
			email: null,
			password: null,
			otpRequired: false,
			otpCode: null
		});
	},

	resetError: function() {
		this.setProperties({
			loginError: false,
			otpError: false,
			loginResponse: ''
		});
	},

	afterLogin: function() {
		this.set('loginError', false);

		var attemptedTransition = Balanced.Auth.get('attemptedTransition');

		if (attemptedTransition) {
			attemptedTransition.retry();
			Balanced.Auth.set('attemptedTransition', null);
		} else {
			this.transitionToRoute('index');
		}

		Balanced.Auth.trigger('signInTransition');
	},

	actions: {
		otpSubmit: function() {
			var self = this;

			Balanced.Auth.confirmOTP(this.get('otpCode')).then(function() {
				self.afterLogin();
			}, function() {
				Balanced.Auth.forgetLogin();
				self.reset();
				self.setProperties({
					loginError: true,
					loginResponse: 'Invalid OTP code. Please login again.'
				});
			});
		},

		reset: function() {
			this.resetError();
		},

		signIn: function() {
			var self = this;

			this.resetError();

			Balanced.Auth.forgetLogin();
			Balanced.Auth.signIn(this.get('email'), this.get('password')).then(function() {
				// When we add the MFA modal to ask users to login
				// self.send('openMFAInformationModal');
				// For now tho:
				self.afterLogin();
			}, function(jqxhr, status, message) {
				self.set('password', null);

				if (jqxhr.status === 401) {
					self.setProperties({
						loginError: true,
						loginResponse: 'Invalid e-mail address or password.'
					});
					return;
				}

				if (typeof jqxhr.responseText !== "undefined") {
					var responseText = JSON.parse(jqxhr.responseText);

					if (jqxhr.status === 409 && responseText.status === 'OTP_REQUIRED') {
						self.set('otpRequired', true);
					} else {
						self.set('loginError', true);

						var error;
						if (typeof responseText.email_address !== 'undefined') {
							error = responseText.email_address[0].replace('This', 'Email');
						} else if (typeof responseText.password !== 'undefined') {
							error = responseText.password[0].replace('This', 'Password');
						}

						if (error) {
							self.set('loginResponse', error);
						}
					}
				}
			});
		}
	}
});
