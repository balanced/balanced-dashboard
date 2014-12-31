import Ember from "ember";
import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger";

var ModalBaseView = Ember.View.extend({
	layoutName: "modals/base-modal-layout",
	classNames: ["modal"],
	submitButtonText: "Submit",

	getNotificationController: function() {
		return this.get("container").lookup("controller:notification-center");
	},

	getModalNotificationController: function() {
		return this.get("container").lookup("controller:modal-notification-center");
	},

	openModal: function(name) {
		this.get("container")
			.lookup("controller:modals-container")
			.open(name, _.toArray(arguments).slice(1));
	},

	trackEvent: function(message, data) {
		var attributes = AnalyticsLogger.flattenEventData({
			formData: data,
			user_email_address: this.container.lookup("auth:main").get("user.email_address")
		});
		AnalyticsLogger.trackEvent(message, attributes);
	},

	reposition: function() {
		$(window).resize();
	},

	open: function(container) {
		var options = {
			show: true,
			backdrop: true,
			keyboard: true
		};

		if (this.get('staticBackdrop')) {
			_.extend(options, {
				backdrop: "static",
				keyboard: false
			});
		}
		return this.$().modal(options);
	},

	close: function() {
		var element = this.$();
		if (element) {
			return element.modal("hide");
		}
	},

	didInsertElement: function() {
		$('.modal input:eq(0)').focus();
	}
});

ModalBaseView.reopenClass({
	open: function(attributes) {
		return this.create(attributes);
	}
});

export default ModalBaseView;
