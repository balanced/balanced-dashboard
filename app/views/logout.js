require('app/views/login');

Balanced.LogoutView = Balanced.LoginView.extend({
	layoutName: 'page-form',
	templateName: 'login_flow/logout',
	pageTitle: 'Logout',
	afterFormLink: function() {
		return {
			linkTo: 'login',
			linkText: 'Back to sign in'
		}
	}.property(),
});
