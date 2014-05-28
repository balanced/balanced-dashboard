require('app/models/transaction');

Balanced.Hold = Balanced.Transaction.extend({
	card: Balanced.Model.belongsTo('card', 'Balanced.FundingInstrument'),
	source: Ember.computed.alias('card'),
	debit: Balanced.Model.belongsTo('debit', 'Balanced.Debit'),

	status: function() {
		if (this.get('debit')) {
			return 'captured';
		} else if (this.get('is_void')) {
			return 'void';
		} else if (this.get('is_expired')) {
			return 'expired';
		} else {
			return 'created';
		}
	}.property('debit', 'is_void', 'is_expired'),

	is_expired: function() {
		return Date.parseISO8601(this.get('expires_at')) < new Date();
	}.property('expires_at'),

	can_void_or_capture: Ember.computed.equal('status', 'created'),
	type_name: 'Hold',
	route_name: 'holds',
	funding_instrument_description: Ember.computed.readOnly('card.description'),
	customer: Balanced.computed.orProperties('debit.customer', 'card.customer'),
	last_four: Ember.computed.readOnly('card.last_four'),
	funding_instrument_name: Ember.computed.readOnly('card.brand'),
	funding_instrument_type: Ember.computed.alias('card.type_name')
});

Balanced.TypeMappings.addTypeMapping('hold', 'Balanced.Hold');
Balanced.TypeMappings.addTypeMapping('card_hold', 'Balanced.Hold');
