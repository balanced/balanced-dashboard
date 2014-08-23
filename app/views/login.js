Balanced.LoginView = Balanced.View.extend({
	layoutName: 'page-form',
	templateName: 'login_flow/login',
	pageTitle: 'Sign in',
	afterFormLink: function() {
		return {
			linkTo: 'setup_guest_user',
			linkText: 'Create an account'
		}
	}.property(),

	model: function() {
		return Balanced.Login.create();
	}.property(),

	didInsertElement: function() {
		$('input[name="email"]', 'input[name="otp_secret"]').focus();
		this._super();
	},

	keyDown: function(e) {
		// Lets make sure we are in the login view
		if (this.templateName !== 'login') {
			return;
		}

		this.get('controller').send('reset');
	}
});
