import LoginView from "../login";

var LogoutView = LoginView.extend({
	templateName: 'login-flow/logout',
	pageTitle: 'Logout',
	afterFormLink: function() {
		return {
			linkTo: 'login',
			linkText: 'Back to sign in'
		};
	}.property(),
});

export default LogoutView;
