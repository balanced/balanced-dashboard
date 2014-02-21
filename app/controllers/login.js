Balanced.LoginController = Balanced.ObjectController.extend({
	email: null,
	password: null,
	loginError: false,
	loginResponse: '',
	otpError: false,
	otpRequired: false,
	otpCode: null,

	init: function() {
		if (Balanced.Auth.get('signedIn')) {
			this.afterLogin();
		} else {
			Balanced.Auth.on('signInSuccess', _.bind(this.afterLogin, this));
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

	focus: function() {
		$('form input[type=text]:first').focus();
	},

	afterLogin: function() {
		this.set('loginError', false);

		var attemptedTransition = Balanced.Auth.get('attemptedTransition');

		if (attemptedTransition) {
			Ember.run.next(function() {
				attemptedTransition.retry();
				Balanced.Auth.set('attemptedTransition', null);
				Balanced.Auth.trigger('signInTransition');
			});
		} else {
			this.transitionToRoute('index');
			Balanced.Auth.trigger('signInTransition');
		}
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

				self.focus();
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
				self.focus();
				self.set('password', null);

				if (jqxhr.status === 401) {
					self.setProperties({
						loginError: true,
						loginResponse: 'Invalid e-mail address or password.'
					});
					return;
				}

				if (typeof jqxhr.responseText !== "undefined") {
					var responseText = jqxhr.responseJSON || JSON.parse(jqxhr.responseText);

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
			});
		}
	}
});
