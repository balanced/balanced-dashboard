Balanced.TxnHoldComponent = Ember.Component.extend({
	submitCaptureHoldEvent: 'submitCaptureHold',

	submitCaptureHold: function(debit) {
		this.sendAction('submitCaptureHoldEvent', debit);
	}
});
