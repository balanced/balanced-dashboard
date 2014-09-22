Balanced.NextStepView = Balanced.RegisterFlowBaseModal.extend({
	layoutName: "modals/base-modal-layout",
	templateName: "register-flow/next-step-modal",
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
