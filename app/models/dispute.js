Balanced.Dispute = Balanced.Model.extend(Ember.Validations, {
	transaction: Balanced.Model.belongsTo('transaction', 'Balanced.Transaction'),
	events: Balanced.Model.hasMany('events', 'Balanced.Event'),
	documents: Balanced.Model.hasMany('dispute_documents', 'Balanced.DisputeDocument'),
	dispute_note: function() {
		var note = this.get('note');
		return note ? note : 'none';
	}.property('note'),

	isDocumentsLoaded: function() {
		if (this.get('documents.length') > 0) {
			return this.get('documents.isLoaded');
		} else {
			return true;
		}
	}.property('documents.length', 'documents.isLoaded'),

	type_name: 'Dispute',
	route_name: 'dispute',

	uri: '/disputes',
	events_uri: Balanced.computed.concat('uri', '/events'),

	dispute_uri: function() {
		return '/disputes/' + this.get('id');
	}.property('id'),

	dispute_documents_uri: function() {
		return '/disputes/' + this.get('id') + '/documents';
	}.property('id'),

	statusChanged: function() {
		var status = this.get('status');

		if (this.get('isDocumentsLoaded') && status === 'pending') {
			if (this.get('hasExpired') || this.get('documents.length') > 0) {
				this.set('status', 'submitted');
			} else {
				this.set('status', 'new');
			}
		}
	}.observes('isDocumentsLoaded', 'status', 'documents.length', 'hasExpired').on('init'),

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

	hasExpired: function() {
		return moment(this.get('respond_by')).toDate() < moment().toDate();
	}.property('respond_by'),

	canUploadDocuments: function() {
		if (this.get('isDocumentsLoaded')) {
			return !this.get('hasExpired') && (this.get('status') === 'new') && (this.get('documents.length') === 0);
		} else {
			return false;
		}
	}.property('isDocumentsLoaded', 'hasExpired', 'status', 'documents.length')
});

Balanced.TypeMappings.addTypeMapping('dispute', 'Balanced.Dispute');
