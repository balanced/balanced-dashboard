require('app/models/transaction');

Balanced.Reversal = Balanced.Transaction.extend({
	credit: Balanced.Model.belongsTo('credit', 'Balanced.Credit'),

	type_name: function() {
		return "Reversal";
	}.property(),

	route_name: function() {
		return "reversals";
	}.property(),

	last_four: Ember.computed.alias('credit.last_four'),
	funding_instrument_name: Ember.computed.alias('credit.funding_instrument_name'),
	funding_instrument_description: Ember.computed.readOnly('credit.funding_instrument_description'),
	customer: Ember.computed.readOnly('credit.customer')
});

Balanced.TypeMappings.addTypeMapping('reversal', 'Balanced.Reversal');
