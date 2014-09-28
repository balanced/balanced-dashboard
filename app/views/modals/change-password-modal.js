import ModalBaseView from "./modal-base";
import Auth from "balanced-dashboard/auth";
import User from "balanced-dashboard/models/user";
import WideModalMixin from "./mixins/wide-modal-mixin";

var getUserModel = function(uri, emailAddress) {
	var user = BalancedApp.__container__.lookupFactory("model:user").create({
		isNew: false,
		uri: uri,
		validations: {
			confirm_password: {
				presence: true,
				matches: {
					validator: function(object, attribute, value) {
						var password = object.get('password');
						if (value !== password) {
							object.get('validationErrors').add(attribute, 'invalid', null, "must match password");
						}
					}
				}
			},
			password: {
				presence: true
			},
			existing_password: {
				presence: true
			},
		}
	});
	return user;
};

var ChangePasswordModalView = ModalBaseView.extend(WideModalMixin, {
	templateName: "modals/change-password-modal",
	elementId: "change-password-modal",
	title: "Change password",

	onSuccess: function() {
		Auth.get("user").reload();
		var message = 'Your email address has been updated.';
		this.get('controller.controllers.notification_center').alertSuccess(message);
	},

	validateAndSave: function(model) {
		model.get("validationErrors").clear();
		model.validate();

		if (model.get("isValid")) {
			return model.save()
		} else {
			return Ember.RSVP.reject(model.get("validationErrors"));
		}
	},

	isSaving: false,
	actions: {
		submit: function(model) {
			var self = this;
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
		},
	}
});

ChangePasswordModalView.reopenClass({
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

export default ChangePasswordModalView;
