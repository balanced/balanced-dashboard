import Ember from "ember";
import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger";

var getModelRootErrorMessages = function(model) {
	var messages = model.get("validationErrors.allMessages");
	var errorMessage = "Your information could not be saved.";

	var hasPropertyError = _.find(messages, function(error) {
		return !Ember.isBlank(error[0]);
	});

	if (hasPropertyError) {
		errorMessage = "Your information could not be saved. Please correct the errors below.";
	}
	return errorMessage;
};

var DisplayModelErrorsModalMixin = Ember.Mixin.create(Ember.Validations, {
	updateErrorsBar: function() {
		var errorMessage = getModelRootErrorMessages(this.get("model"));
		if (errorMessage) {
			var controller = this.get("container").lookup("controller:modal_notification_center");
			controller.clearAlerts();
			controller.alertError(new Ember.Handlebars.SafeString(errorMessage));
		}

		AnalyticsLogger.trackEvent(errorMessage, {
			path: this.get("container").lookup("controller:application").get('currentRouteName')
		});
	}.observes("model.validationErrors.allMessages"),
});

export default DisplayModelErrorsModalMixin;
