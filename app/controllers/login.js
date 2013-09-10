Balanced.LoginController = Balanced.ObjectController.extend({
	email: null,
	password: null,
	loginError: false,
	loginResponse: '',

	signIn: function () {
		var self = this;
		Balanced.Auth.forgetLogin();
		Balanced.Auth.signIn(this.get('email'), this.get('password')).then(function() {
			self.set('loginError', false);

			var attemptedTransition = Balanced.Auth.get('attemptedTransition');
			if (attemptedTransition) {
				attemptedTransition.retry();
				Balanced.Auth.set('attemptedTransition', null);
			} else {
				self.transitionToRoute('index');
			}
		}, function(jqxhr, status, message) {
			self.set('loginError', true);

			if (jqxhr.status === 401) {
				self.set('loginResponse', 'Invalid e-mail address or password.');
				return;
			}

			if (typeof jqxhr.responseText !== "undefined") {
				var responseText = JSON.parse(jqxhr.responseText);
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
		});
	}
});
