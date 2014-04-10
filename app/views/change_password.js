Balanced.ChangePasswordModalView = Balanced.ChangeEmailModalView.extend({
	templateName: 'modals/change_password',
	controllerEventName: 'openChangePasswordModal',
	fieldName: 'password',
	defaultError: 'Oops, we failed to change your password. Please try again.',
	modelKeys: ['password', 'existing_password', 'confirm_password'],

	open: function() {
		var user = Ember.copy(Balanced.Auth.get('user'), true);
		user.set('email', user.get('email_address'));
		this._super(user);
	}
});
