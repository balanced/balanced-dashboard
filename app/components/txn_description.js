Balanced.TxnDescriptionComponent = Ember.Component.extend({
	type: function() {
		var type = (this.get('transaction.type_name') + '').toLowerCase();
		return {
			credit: type === 'credit',
			debit: type === 'debit',
			refund: type === 'refund',
			hold: type === 'hold',
			reversal: type === 'reversal'
		};
	}.property('transaction.type_name')
});
