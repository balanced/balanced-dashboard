Balanced.TxnCreditComponent = Ember.Component.extend({
	submitReverseCreditEvent: 'submitReverseCredit',

	submitReverseCredit: function(reversal) {
		this.sendAction('submitReverseCreditEvent', reversal);
	}
});
