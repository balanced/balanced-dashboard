import LoginView from "../login";

var ResetPasswordView = LoginView.extend({
	templateName: 'login_flow/reset_password',
	pageTitle: 'Reset password',
	afterFormLink: null,
});

export default ResetPasswordView;
