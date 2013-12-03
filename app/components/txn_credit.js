Balanced.TxnCreditComponent = Ember.Component.extend({
	submitReverseCreditEvent: 'submitReverseCredit',

	actions: {
		submitReverseCredit: function(reversal) {
			this.sendAction('submitReverseCreditEvent', reversal);
		},
	},

	can_reverse_credit: function() {
		return this.get('credit.can_reverse');
	}.property('credit.can_reverse')
});
