import LoginView from "./login";

var ForgotPasswordView = LoginView.extend({
	templateName: 'forgot-password',
	pageTitle: 'Reset password',
	afterFormLink: function() {
		return {
			linkTo: 'login',
			linkText: 'Back to sign in'
		};
	}.property(),
});

export default ForgotPasswordView;
