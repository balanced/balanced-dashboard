import Ember from "ember";

var ModalBaseView = Ember.View.extend({
	layoutName: "modals/base-modal-layout",
	classNames: ["modal"],
	submitButtonText: "Submit",

	reposition: function() {
		$(window).resize();
	},

	open: function(container) {
		var options = {
			show: true,
			backdrop: true
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
