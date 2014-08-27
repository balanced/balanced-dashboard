Balanced.NextStepView = Balanced.RegisterFlowBaseModal.extend({
	layoutName: "modals/base_modal_layout",
	templateName: "register_flow/next_step_modal",
	title: "Next step",
	continueButtonText: "Register",
	cancelButtonText: "Go to dashboard",
	elementId: "next-step",

	actions: {
		nextStep: function() {
			this.openNext(Balanced.ApiKeyCreateModalView);
		},

		goToDashboard: function() {
			this.close();
		}
	}
});
