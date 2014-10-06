import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Wide from "./mixins/wide-modal-mixin";
import Auth from "balanced-dashboard/auth";

var DisableAuthModalView = ModalBaseView.extend(Wide, Form, {
	title: "Disable two-factor authentication",
	elementId: "disable-auth",
	classNames: ["wide-modal"],
	templateName: "modals/confirm-modal",
	confirmMessage: "Are you sure you want to disable two-factor authentication? Future logins will only require your email and password.",
	cancelButtonText: "Cancel",
	submitButtonText: "Disable",

	actions: {
		save: function() {
			var self = this;
			this.close();
			Auth.disableMultiFactorAuthentication()
				.then(function() {
					self.getNotificationController()
						.alertSuccess('Two-factor authentication is disabled.', 3000);
					Auth.get("user").reload();
				});
		}
	}
});

export default DisableAuthModalView;
