import ModalComponent from "./modal";

var ConfirmModalComponent = ModalComponent.extend({

	reset: function() {
		this.off("cancel");
		this.off("confirm");
	},

	actions: {
		cancel: function() {
			this.trigger("cancel");
		},
		confirm: function() {
			this.trigger("confirm");
		}
	}
});

export default ConfirmModalComponent;
