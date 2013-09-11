Balanced.TxnCreditComponent = Ember.Component.extend({
	submitReverseCreditEvent: 'submitReverseCredit',

	submitReverseCredit: function(reversal) {
		this.sendAction('submitReverseCreditEvent', reversal);
	},

	can_reverse_credit: function() {
		return this.get('credit.can_reverse') && (this.get('marketplace.can_reverse_transactions') || Balanced.Auth.get('user.admin'));
	}.property('credit.can_reverse', 'marketplace.can_reverse_transactions', 'Balanced.Auth.user.admin')
});
