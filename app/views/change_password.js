Balanced.ChangePasswordModalView = Balanced.ChangeEmailModalView.extend({
	templateName: 'modals/change_password',
	controllerEventName: 'openChangePasswordModal',

	open: function() {
		var user = Ember.copy(Balanced.Auth.get('user'), true);
		user.set('email', user.get('email_address'));
		this._super(user);
	}
});
