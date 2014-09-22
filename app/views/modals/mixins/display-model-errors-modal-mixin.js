import Ember from "ember";
import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger";

var DisplayModelErrorsModalMixin = Ember.Mixin.create(Ember.Validations, {
	updateErrorsBar: function() {
		var controller = this.get("container").lookup("controller:modal_notification_center");
		var self = this;
		var errorMessage;

		controller.clear();
		this.get("model.validationErrors.allMessages").forEach(function(error) {
			if (Ember.isBlank(error[0])) {
				errorMessage += "<br>%@".fmt(error[1]);
			} else {
				errorMessage = "Your information could not be saved. Please correct the errors below.";
			}
		});

		if (errorMessage) {
			controller.clearAlerts();
			controller.alertError(new Ember.Handlebars.SafeString(errorMessage));
		}

		AnalyticsLogger.trackEvent(errorMessage, {
			path: self.get("container").lookup("controller:application").get('currentRouteName')
		});


	}.observes("model.validationErrors.allMessages"),
});

export default DisplayModelErrorsModalMixin;
