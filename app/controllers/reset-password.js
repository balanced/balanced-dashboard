import Ember from "ember";

var ResetPasswordController = Ember.ObjectController.extend({
	needs: ["notification_center"],
	password: null,
	password_confirm: null,
	hasError: false,

	actions: {
		resetPassword: function() {
			var model = this.get('model');
			var self = this;
			var baseUri = location.hash.indexOf('invite') > 0 ? '/invite/' : '/password/';

			model.setProperties({
				uri: baseUri + model.get('token'),
				password: model.get('password'),
				password_confirm: model.get('password_confirm')
			});

			if (model.validate()) {
				self.set('hasError', false);

				model.one('becameInvalid', function() {
					self.set('hasError', true);
				});

				model.one('becameError', function() {
					self.set('hasError', true);
				});

				model.save()
					.then(function() {
						model.setProperties({
							password: null,
							password_confirm: null,
						});
						var controller = self.get("controllers.notification_center");
						controller.clearAlerts();
						controller.alertSuccess("Your password has been successfully updated.");
					});
			} else {
				self.set('hasError', true);
			}
		}
	}
});

export default ResetPasswordController;
