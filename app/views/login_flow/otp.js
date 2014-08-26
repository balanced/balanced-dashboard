require('app/views/login_flow/login');

Balanced.OtpView = Balanced.LoginView.extend({
	templateName: 'login_flow/otp',
	pageTitle: 'Two-factor authentication',

	afterFormLink: function() {
		return {
			linkTo: 'login',
			linkText: 'Back to sign in'
		};
	}.property(),
});
