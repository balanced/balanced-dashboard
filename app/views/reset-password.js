import LoginView from "./login";

var ResetPasswordView = LoginView.extend({
	templateName: 'reset-password',
	pageTitle: 'Reset password',
	afterFormLink: null,
});

export default ResetPasswordView;
