import ChangeEmailModalView from "./change-email-modal";

var ChangePasswordModalView = ChangeEmailModalView.extend({
	controllerEventName: 'openChangePasswordModal',
	fieldName: 'password',
	defaultError: 'Oops, we failed to change your password. Please try again.',

	open: function() {
		var user = Ember.copy(Balanced.Auth.get('user'), true);
		this._super(user);
	}
});

export default ChangePasswordModalView;
