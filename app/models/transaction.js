require('app/models/mixins/meta_array');

var Computed = {
	isStatus: function(status) {
		return Ember.computed.equal('status', status);
	}
};

Balanced.Transaction = Balanced.Model.extend(
	Balanced.MetaArrayMixin, {
		account: Balanced.Model.belongsTo('account', 'Balanced.Account'),
		customer: Balanced.Model.belongsTo('customer', 'Balanced.Customer'),
		events: Balanced.Model.hasMany('events', 'Balanced.Event'),

		amount_dollars: function() {
			if (this.get('amount')) {
				return (this.get('amount') / 100).toFixed(2);
			} else {
				return '';
			}
		}.property('amount'),

		customer_name_summary: function() {
			if (this.get('customer')) {
				return this.get('customer.display_me_with_email');
			} else {
				return 'None';
			}
		}.property('customer'),

		page_title: Balanced.computed.orProperties('description', 'id'),
		events_uri: Balanced.computed.concat('uri', '/events'),

		status_description: function() {
			if (this.get('is_failed')) {
				if (this.get('failure_reason') || this.get('failure_reason_code')) {
					return this.get('failure_reason') || this.get('failure_reason_code');
				}
				return 'The transaction failed, no failure reason was given.';
			} else {
				return Ember.String.capitalize(this.get('status'));
			}
		}.property('is_failed', 'status', 'failure_reason', 'failure_reason_code'),

		is_failed: Computed.isStatus('failed'),
		is_pending: Computed.isStatus('pending'),
		is_succeeded: Computed.isStatus('succeeded')
	});
