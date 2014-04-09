require('app/models/transaction');

Balanced.Refund = Balanced.Transaction.extend({
	debit: Balanced.Model.belongsTo('debit', 'Balanced.Debit'),
	dispute: Balanced.Model.belongsTo('dispute', 'Balanced.Dispute'),

	type_name: 'Refund',
	route_name: 'refunds',
	funding_instrument_description: Ember.computed.readOnly('debit.funding_instrument_description'),
	customer: Ember.computed.readOnly('debit.customer')
});

Balanced.TypeMappings.addTypeMapping('refund', 'Balanced.Refund');
