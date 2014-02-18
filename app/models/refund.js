require('app/models/transaction');

Balanced.Refund = Balanced.Transaction.extend({
	debit: Balanced.Model.belongsTo('debit', 'Balanced.Debit'),
	dispute: Balanced.Model.belongsTo('dispute', 'Balanced.Dispute'),

	type_name: function() {
		return "Refund";
	}.property(),

	route_name: function() {
		return "refunds";
	}.property(),

	funding_instrument_description: function() {
		return this.get('debit.funding_instrument_description');
	}.property('debit.funding_instrument_description'),

	customer: function() {
		return this.get('debit.customer');
	}.property('debit.customer')
});

Balanced.TypeMappings.addTypeMapping('refund', 'Balanced.Refund');
