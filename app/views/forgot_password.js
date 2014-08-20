require('app/views/login');

Balanced.ForgotPasswordView = Balanced.LoginView.extend({
	templateName: 'forgotPassword',
	didInsertElement: function() {
		$('input[name="otp_secret"]').focus();
	}
});
