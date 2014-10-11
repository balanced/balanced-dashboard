import Auth from "balanced-dashboard/auth";
import User from "balanced-dashboard/models/user";

import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "./mixins/full-modal-mixin";

var getUserModel = function(uri, emailAddress) {
	var user = BalancedApp.__container__.lookupFactory("model:user").create({
		email_address: emailAddress,
		email: emailAddress,
		isNew: false,
		uri: uri,
		validations: {
			existing_password: {
				presence: true
			},
			email: {
				presence: true,
				format: /.+@.+\..{2,4}/,
				length: {
					minimum: 6
				}
			}
		}
	});
	return user;
};

var ChangeEmailModalView = ModalBaseView.extend(Full, Form, {
	title: "Change email address",
	elementId: "change-email-modal",
	templateName: "modals/change-email-modal",
	cancelButtonText: "Cancel",
	submitButtonText: "Change",

	isSaving: false,

	onSuccess: function() {
		Auth.get("user").reload();
		var message = 'Your email address has been updated.';
		this.get('controller.controllers.notification_center').alertSuccess(message);
	},

	validateAndSave: function(model) {
		model.get("validationErrors").clear();
		model.validate();

		if (model.get("isValid")) {
			return model.save();
		} else {
			return Ember.RSVP.reject(model.get("validationErrors"));
		}
	},

	actions: {
		save: function() {
			var self = this;
			var model = this.get("model");
			var notifications = self.get("container").lookup("controller:modal-notification-center");
			notifications.clearAlerts();
			self.set("isSaving", true);
			this.validateAndSave(model)
				.then(function() {
					self.onSuccess();
					self.close();
				}, function(errorResponse) {
					(errorResponse.non_field_errors || []).forEach(function(message) {
						notifications.alertError(message);
					});
				})
				.finally(function() {
					self.set("isSaving", false);
				});
		}
	},
});

ChangeEmailModalView.reopenClass({
	open: function() {
		var originalUser = Auth.get("user");
		var emailAddress = originalUser.get("email_address");
		var uri = originalUser.get("uri");
		return this.create({
			currentEmailAddress: emailAddress,
			model: getUserModel(uri, emailAddress)
		});
	}
});

export default ChangeEmailModalView;
