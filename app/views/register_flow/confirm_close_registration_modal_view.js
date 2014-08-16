var Full = Balanced.Modals.FullModalMixin;
var OpenNext = Balanced.Modals.OpenNextModalMixin;

Balanced.ConfirmCloseRegistrationModalView = Balanced.ModalBaseView.extend(Full, OpenNext, {
	templateName: "register_flow/confirm_close_registration_modal",
	title: "Cancel registration?",
	submitButtonText: "Cancel registration",
	cancelButtonText: "Resume",
	actions: {
		retry: function() {
			this.openNext(this.get("previousModal"));
		}
	}
});
