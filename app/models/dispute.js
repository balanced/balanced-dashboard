require('app/models/mixins/meta_array');

Balanced.Dispute = Balanced.Model.extend(Balanced.MetaArrayMixin, {
	transaction: Balanced.Model.belongsTo('transaction', 'Balanced.Transaction'),
	// events: Balanced.Model.hasMany('events', 'Balanced.Event'),

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

	funding_instrument_description: function() {
		return this.get('transaction.funding_instrument_description');
	}.property('transaction.funding_instrument_description', 'transaction'),

	page_title: function() {
		return this.get('transaction.description') || this.get('transaction.id');
	}.property('transaction.description', 'transaction.id', 'transaction'),

	status_name: function() {
		return Balanced.Utils.capitalize(this.get('status'));
	}.property('status'),

	is_lost: function() {
		return this.get('status') === 'lost';
	}.property('status'),

	is_won: function() {
		return this.get('status') === 'won';
	}.property('status'),

	is_pending: function() {
		return this.get('status') === 'pending';
	}.property('status'),

	type_name: function() {
		return 'Dispute';
	}.property(),

	route_name: function() {
		return 'disputes';
	}.property(),

	events_uri: function() {
		return this.get('uri') + '/events';
	}.property(),

	uri: '/disputes'
});

Balanced.TypeMappings.addTypeMapping('dispute', 'Balanced.Dispute');
