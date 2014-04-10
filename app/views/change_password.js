Balanced.ChangePasswordModalView = Balanced.ChangeEmailModalView.extend({
	templateName: 'modals/change_password',
	controllerEventName: 'openChangePasswordModal',
	fieldName: 'password',
	defaultError: 'Oops, we failed to change your password. Please try again.',

	open: function() {
		var user = Ember.copy(Balanced.Auth.get('user'), true);
		this._super(user);
	}
});
