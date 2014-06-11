var Computed = {
	isStatus: function(status) {
		return Ember.computed.equal('status', status);
	}
};

Balanced.Dispute = Balanced.Model.extend({
	transaction: Balanced.Model.belongsTo('transaction', 'Balanced.Transaction'),
	events: Balanced.Model.hasMany('events', 'Balanced.Event'),

	amount_dollars: function() {
		if (this.get('amount')) {
			return (this.get('amount') / 100).toFixed(2);
		} else {
			return '';
		}
	}.property('amount'),

	customer_display_me: Ember.computed.alias('transaction.customer.display_me'),
	customer_email: Ember.computed.alias('transaction.customer.email'),

	last_four: Ember.computed.alias('transaction.last_four'),
	bank_name: Ember.computed.alias('transaction.bank_name'),
	funding_instrument_description: Ember.computed.oneWay('transaction.funding_instrument_description').readOnly(),
	funding_instrument_name: Ember.computed.alias('transaction.funding_instrument_name'),
	funding_instrument_type: Ember.computed.alias('transaction.funding_instrument_type'),
	page_title: Balanced.computed.orProperties('transaction.description', 'transaction.id'),

	status_name: Ember.computed.alias('status'),

	is_lost: Computed.isStatus('lost'),
	is_won: Computed.isStatus('won'),
	is_pending: Computed.isStatus('pending'),

	type_name: 'Dispute',
	route_name: 'dispute',
	events_uri: Balanced.computed.concat('uri', '/events'),
	uri: '/disputes'
});

Balanced.TypeMappings.addTypeMapping('dispute', 'Balanced.Dispute');
