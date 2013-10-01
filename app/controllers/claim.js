Balanced.ClaimController = Balanced.ObjectController.extend({
	needs: ['marketplace'],

	error: function(field, prefix) {
		var errors = this.get('validationErrors.' + field + '.messages');
		if (errors) {
			var error = errors[0];
			if (error.indexOf(prefix) !== 0) {
				error = prefix + ' ' + error;
			}
			return error;
		}
	},

	emailLabel: function() {
		return this.error('email_address', 'Email') || 'Enter your email';
	}.property('validationErrors.email'),

	passwordLabel: function() {
		return this.error('password', 'Password') || 'Create a password';
	}.property('validationErrors.password'),

	passwordConfirmLabel: function() {
		return this.error('passwordConfirm', 'Password') || 'Re-enter your password';
	}.property('validationErrors.passwordConfirm')
});
