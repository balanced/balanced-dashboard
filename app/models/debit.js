require('app/models/transaction');

Balanced.Debit = Balanced.Transaction.extend({
	source: Balanced.Model.belongsTo('source', 'Balanced.FundingInstrument'),
	hold: Balanced.Model.belongsTo('hold', 'Balanced.Hold'),
	refunds: Balanced.Model.hasMany('refunds', 'Balanced.Refund'),

	type_name: function() {
		return "Debit";
	}.property(),

	route_name: function() {
		return "debits";
	}.property(),

	funding_instrument_description: function() {
		return this.get('source.description');
	}.property('source.description'),

	can_refund: function() {
		return this.get('status') !== 'failed';
	}.property('status')
});

Balanced.TypeMappings.addTypeMapping('debit', 'Balanced.Debit');
