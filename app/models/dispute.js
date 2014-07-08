Balanced.Dispute = Balanced.Model.extend(Ember.Validations, {
	transaction: Balanced.Model.belongsTo('transaction', 'Balanced.Transaction'),
	events: Balanced.Model.hasMany('events', 'Balanced.Event'),
	documents: function() {
		return Balanced.DisputeDocument.loadFromUri(this.get('dispute_documents_uri'));
	}.property("dispute_documents_uri"),
	isDocumentsLoaded: Ember.computed.alias('documents.isLolded'),
	type_name: 'Dispute',
	route_name: 'dispute',
	events_uri: Balanced.computed.concat('uri', '/events'),
	uri: '/disputes',
	dispute_note: Ember.computed.oneWay('note'),

	dispute_documents_uri: function() {
		return '/disputes/' + this.get('id');
	}.property('id'),

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

	hasNotExpired: function() {
		return moment(this.get('respond_by')).toDate() > moment().toDate();
	}.property('respond_by'),

	canUploadDocuments: function() {
		return this.get('isDocumentsLoaded') && this.get('hasNotExpired') && (this.get('status') === 'pending') && (this.get('documents.length') === 0);
	}.property('isDocumentsLoaded', 'hasNotExpired', 'status', 'documents.length')
});

Balanced.TypeMappings.addTypeMapping('dispute', 'Balanced.Dispute');
