import FullModalMixin from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import OpenNextModalMixin from "balanced-dashboard/views/modals/mixins/open-next-modal-mixin";
import ModalBaseView from "balanced-dashboard/views/modal-base";

var ConfirmCloseRegistrationModalView = ModalBaseView.extend(FullModalMixin, OpenNextModalMixin, {
	templateName: "register_flow/confirm_close_registration_modal",
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
