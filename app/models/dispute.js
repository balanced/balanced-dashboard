require('app/models/mixins/meta_array');

var Computed = {
	isStatus: function(status) {
		return Ember.computed.equal('status', status);
	}
};

Balanced.Dispute = Balanced.Model.extend(Balanced.MetaArrayMixin, {
	transaction: Balanced.Model.belongsTo('transaction', 'Balanced.Transaction'),
	events: Balanced.Model.hasMany('events', 'Balanced.Event'),

	amount_dollars: function() {
		if (this.get('amount')) {
			return (this.get('amount') / 100).toFixed(2);
		} else {
			return '';
		}
	}.property('amount'),

	customer_name_summary: function() {
		if (this.get('transaction.customer')) {
			return this.get('transaction.customer.display_me_with_email');
		} else {
			return 'None';
		}
	}.property('transaction.customer', 'transaction'),

	last_four: Ember.computed.alias('transaction.last_four'),
	bank_name: Ember.computed.alias('transaction.bank_name'),
	funding_instrument_description: Ember.computed.oneWay('transaction.funding_instrument_description').readOnly(),
	page_title: Balanced.computed.orProperties('transaction.description', 'transaction.id'),

	status_name: function() {
		return Balanced.Utils.capitalize(this.get('status'));
	}.property('status'),

	is_lost: Computed.isStatus('lost'),
	is_won: Computed.isStatus('won'),
	is_pending: Computed.isStatus('pending'),

	type_name: 'Dispute',
	route_name: 'disputes',
	events_uri: Balanced.computed.concat('uri', '/events'),
	uri: '/disputes'
});

Balanced.TypeMappings.addTypeMapping('dispute', 'Balanced.Dispute');
