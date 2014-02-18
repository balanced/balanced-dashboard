require('app/models/transaction');

Balanced.Debit = Balanced.Transaction.extend({
	source: Balanced.Model.belongsTo('source', 'Balanced.FundingInstrument'),
	hold: Balanced.Model.belongsTo('hold', 'Balanced.Hold'),
	refunds: Balanced.Model.hasMany('refunds', 'Balanced.Refund'),
	dispute: Balanced.Model.belongsTo('dispute', 'Balanced.Dispute'),

	refund_amount: 0,

	type_name: function() {
		return "Debit";
	}.property(),

	route_name: function() {
		return "debits";
	}.property(),

	funding_instrument_description: function() {
		return this.get('source.description');
	}.property('source.description'),

	get_refunds: function() {
		var _this = this;
		try {
			this.get('refunds').then(function(refunds) {
				_this.set('refund_amount', refunds.reduce(function(amount, refund) {
					if (refund.get('status') !== 'failed') {
						return amount + refund.get('amount');
					} else {
						return amount;
					}
				}, 0));
			});
		} catch (e) {
			this.set('refund_amount', 0);
		}
	}.on('didLoad'),

	can_refund: function() {
		return this.get('amount') > this.get('refund_amount');
	}.property('amount', 'refund_amount')
});

Balanced.TypeMappings.addTypeMapping('debit', 'Balanced.Debit');
