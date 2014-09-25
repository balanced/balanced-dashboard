import ModalView from "./modal";
import Auth from "balanced-dashboard/auth";

var ChangeEmailModalView = ModalView.extend({
	templateName: "modals/change-email",
	controllerKey: 'controller.controllers.application',
	controllerEventName: 'openChangeEmailModal',
	fieldName: 'email address',
	defaultError: 'Oops, this email address is already associated to an account.',

	open: function(model) {
		var user = model;

		if (!user) {
			user = Ember.copy(Auth.get('user'), true);
			user.set('email', user.get('email_address'));

			// HACK to validate user emails
			user.validations.email = {
				presence: true,
				length: {
					minimum: 6
				},
				format: /.+@.+\..{2,4}/
			};

			// Necessary hack to get the password correct
			user.set('password', undefined);
		}

		this._super(user);

		_.delay(_.bind(function() {
			this.$('input:text').focus();
		}, this));
	},

	beforeSave: function() {
		var user = this.get('model');

		_.each(user, function(val, key) {
			if (!val) {
				this.set(key, undefined);
			}
		}, user);

		//  bug in ember-validation requires this extra check for length
		if (!user.validate() && user.get('validationErrors.length')) {
			user.setProperties({
				displayErrorDescription: true,
				errorDescription: 'Please fix the errors below.'
			});

			return false;
		}

		// Turn off errors
		user.setProperties({
			displayErrorDescription: false,
			errorDescription: ''
		});
	},

	errorSaving: function() {
		var user = this.get('model');

		user.setProperties({
			displayErrorDescription: true,
			errorDescription: this.get('defaultError')
		});
	},

	afterSave: function() {
		Auth.get('user').reload();
		this.hide();

		var message = 'Your %@ has been updated.'.fmt(this.get("fieldName"));
		this.get('controller.controllers.notification_center').alertSuccess(message);
	}
});

export default ChangeEmailModalView;
