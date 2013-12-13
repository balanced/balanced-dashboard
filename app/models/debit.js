require('app/models/transaction');

Balanced.Debit = Balanced.Transaction.extend({
	source: Balanced.Model.belongsTo('source', 'Balanced.FundingInstrument'),
	hold: Balanced.Model.belongsTo('hold', 'Balanced.Hold'),
	refunds: Balanced.Model.hasMany('refunds', 'Balanced.Refund'),

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
		this.get('refunds').then(function(refunds) {
			var accumulator = 0;
			refunds.forEach(function(refund) {
				accumulator += refund.amount;
			});
			_this.set('refund_amount', accumulator);
		});
	}.on('didLoad'),

	can_refund: function() {
		return this.get('amount') > this.get('refund_amount');
	}.property('amount', 'refund_amount')
});

Balanced.TypeMappings.addTypeMapping('debit', 'Balanced.Debit');
