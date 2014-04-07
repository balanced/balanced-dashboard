Balanced.ChangeEmailModalView = Balanced.ModalView.extend({
	templateName: 'modals/change_email',
	controllerKey: 'controller.controllers.application',
	controllerEventName: 'openChangeEmailModal',

	open: function() {
		var user = Ember.copy(Balanced.Auth.get('user'), true);
		user.set('email', user.get('email_address'));

		// Necessary hack to get the password correct
		user.set('password', undefined);
		this._super(user);
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
			errorDescription: 'Oops, we failed to change your email. Please try again.'
		});
	},

	afterSave: function() {
		Balanced.Auth.get('user').reload();
	}
});
