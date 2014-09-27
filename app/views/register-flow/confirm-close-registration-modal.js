import FullModalMixin from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import OpenNextModalMixin from "balanced-dashboard/views/modals/mixins/open-next-modal-mixin";
import ModalBaseView from "balanced-dashboard/views/modals/modal-base";

var ConfirmCloseRegistrationModalView = ModalBaseView.extend(FullModalMixin, OpenNextModalMixin, {
	templateName: "register-flow/confirm-close-registration-modal",
	staticBackdrop: true,
	title: "Cancel registration?",
	submitButtonText: "Cancel registration",
	cancelButtonText: "Resume",
	actions: {
		retry: function() {
			this.openNext(this.get("previousModal"));
		}
	}
});

export default ModalBaseView;
