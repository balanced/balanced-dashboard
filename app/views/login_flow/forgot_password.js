require('app/views/login_flow/login');

Balanced.ForgotPasswordView = Balanced.LoginView.extend({
	templateName: 'login_flow/forgot_password',
	pageTitle: 'Reset password',
	afterFormLink: function() {
		return {
			linkTo: 'login',
			linkText: 'Back to sign in'
		}
	}.property(),
});
