Balanced.StartController = Balanced.ObjectController.extend({
	needs: ['application'],
	actions: {
		goToDashboard: function() {
			this.transitionToRoute('marketplace', this.currentModel);
		},
		goToDocumentation: function() {
			window.location = 'https://docs.balancedpayments.com';
		},
		goToSignUp: function() {
			this.transitionToRoute('sign_up');
		},
	}
});
