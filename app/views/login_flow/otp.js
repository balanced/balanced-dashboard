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
