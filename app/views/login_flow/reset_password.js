require('app/views/login_flow/login');

Balanced.ResetPasswordView = Balanced.LoginView.extend({
	templateName: 'login_flow/reset_password',
	pageTitle: 'Reset password',
	afterFormLink: null,
});
