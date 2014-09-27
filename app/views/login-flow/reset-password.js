import LoginView from "../login";

var ResetPasswordView = LoginView.extend({
	templateName: 'login-flow/reset-password',
	pageTitle: 'Reset password',
	afterFormLink: null,
});

export default ResetPasswordView;
