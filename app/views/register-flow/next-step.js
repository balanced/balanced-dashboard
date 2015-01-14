import RegisterFlowBaseModalView from "./register-flow-base-modal";

var NextStepView = RegisterFlowBaseModalView.extend({
	layoutName: "modals/base-modal-layout",
	templateName: "register-flow/next-step-modal",
	title: "Next step",
	continueButtonText: "Register",
	cancelButtonText: "Go to dashboard",
	elementId: "next-step",

	actions: {
		nextStep: function() {
			this.openModal("modals/marketplace-application-create");
		},

		goToDashboard: function() {
			this.close();
		}
	}
});

export default NextStepView;
