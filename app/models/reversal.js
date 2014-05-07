require('app/models/transaction');

Balanced.Reversal = Balanced.Transaction.extend({
	credit: Balanced.Model.belongsTo('credit', 'Balanced.Credit'),

	type_name: 'Reversal',
	route_name: 'reversals',
	last_four: Ember.computed.readOnly('credit.last_four'),
	card_or_bank_name: Ember.computed.readOnly('credit.card_or_bank_name'),
	funding_instrument_description: Ember.computed.readOnly('credit.funding_instrument_description'),
	customer: Ember.computed.readOnly('credit.customer')
});

Balanced.TypeMappings.addTypeMapping('reversal', 'Balanced.Reversal');
