import Ember from "ember";

var ModalBaseView = Ember.View.extend({
	layoutName: "modals/base-modal-layout",
	classNames: ["modal"],
	submitButtonText: "Submit",

	getNotificationController: function() {
		return this.get("container").lookup("controller:notification_center");
	},

	getModalNotificationController: function() {
		return this.get("container").lookup("controller:modal_notification_center");
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
