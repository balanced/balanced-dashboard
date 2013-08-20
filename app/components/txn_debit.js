Balanced.TxnDebitComponent = Ember.Component.extend({
	submitRefundDebitEvent: 'submitRefundDebit',

	submitRefundDebit: function(refund) {
		this.sendAction('submitRefundDebitEvent', refund);
	}
});
