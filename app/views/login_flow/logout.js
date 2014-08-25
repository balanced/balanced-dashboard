require('app/views/login_flow/login');

Balanced.LogoutView = Balanced.LoginView.extend({
	templateName: 'login_flow/logout',
	pageTitle: 'Logout',
	afterFormLink: function() {
		return {
			linkTo: 'login',
			linkText: 'Back to sign in'
		};
	}.property(),
});
