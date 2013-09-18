Balanced.TxnHoldComponent = Ember.Component.extend({
	submitCaptureHoldEvent: 'submitCaptureHold',

	actions: {
		submitCaptureHold: function(debit) {
			this.sendAction('submitCaptureHoldEvent', debit);
		}
	}
});
