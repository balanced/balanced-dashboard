import ChangeEmailModalView from "./change-email-modal";
import Auth from "balanced-dashboard/auth";

var ChangePasswordModalView = ChangeEmailModalView.extend({
	controllerEventName: 'openChangePasswordModal',
	fieldName: 'password',
	defaultError: 'Oops, we failed to change your password. Please try again.',

	open: function() {
		var user = Ember.copy(Auth.get('user'), true);
		this._super(user);
	}
});

export default ChangePasswordModalView;
