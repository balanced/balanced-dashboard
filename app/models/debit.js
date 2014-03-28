require('app/models/transaction');

Balanced.Debit = Balanced.Transaction.extend({
	refund_amount: 0,
	type_name: "Debit",
	route_name: "debits",

	source: Balanced.Model.belongsTo('source', 'Balanced.FundingInstrument'),
	hold: Balanced.Model.belongsTo('hold', 'Balanced.Hold'),
	refunds: Balanced.Model.hasMany('refunds', 'Balanced.Refund'),
	dispute: Balanced.Model.belongsTo('dispute', 'Balanced.Dispute'),

	funding_instrument_description: Ember.computed.alias('source.description'),
	max_refund_amount_dollars: Balanced.computed.transform('refund_amount', Balanced.Utils.centsToDollars),

	get_refunds: function() {
		var self = this;
		this.get('refunds').then(function(refunds) {
			self.set('refund_amount', refunds.reduce(function(amount, refund) {
				if (!refund.get('is_failed')) {
					return amount + refund.get('amount');
				} else {
					return amount;
				}
			}, 0));
		});
	}.on('didLoad'),

	can_refund: function() {
		return this.get('is_succeeded') && (this.get('amount') > this.get('refund_amount'));
	}.property('amount', 'refund_amount', 'is_succeeded')
});

Balanced.TypeMappings.addTypeMapping('debit', 'Balanced.Debit');
