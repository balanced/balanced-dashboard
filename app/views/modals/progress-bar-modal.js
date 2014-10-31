import Ember from "ember";
import ModalBaseView from "./modal-base";

var ProgressBarModalView = ModalBaseView.extend({
	templateName: "modals/progress-bar-modal",
	classNames: ["modal-progress"],

	getProgressBar: function() {
		return this.$(".progress-bar");
	},

	setProgressBarFraction: function(fractionValue) {
		var element = this.getProgressBar();
		if (element) {
			element.width((fractionValue * 100) + "%");
		}
	},

	actions: {
		cancel: function() {
			this.hide();
			this.trigger("cancel");
		},
	}
});

export default ProgressBarModalView;
